"use client";

import { useState, useEffect } from "react";
import { addMonths, subMonths, addWeeks, subWeeks, isSameDay } from "date-fns";
import { Menu } from "lucide-react";
import CalendarHeader from "./CalendarHeader";
import CalendarSidebar from "./CalendarSidebar";
import MonthView from "./MonthView";
import WeekView from "./WeekView";
import ExamModal from "./ExamModal";
import ExamListView from "./ExamListView";
import { Exam } from "../../types";
import { useAuth } from "../../context/AuthContext";
import { collection, addDoc, onSnapshot, query, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";

export default function CalendarGrid() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<"month" | "week">("month");
  const [exams, setExams] = useState<Exam[]>([]);
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMultiSelectMode, setIsMultiSelectMode] = useState(false);
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
  const [activeTab, setActiveTab] = useState<"calendar" | "exams">("calendar");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const { role, user } = useAuth();
  const isReadOnly = role !== "admin";

  useEffect(() => {
    const q = query(collection(db, "exams"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const examsData = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          date: data.date.toDate(),
        } as Exam;
      });
      setExams(examsData);
    });
    return () => unsubscribe();
  }, []);

  const handlePrev = () => {
    if (view === "month") setCurrentDate(subMonths(currentDate, 1));
    else setCurrentDate(subWeeks(currentDate, 1));
  };

  const handleNext = () => {
    if (view === "month") setCurrentDate(addMonths(currentDate, 1));
    else setCurrentDate(addWeeks(currentDate, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const handleDateClick = (date: Date) => {
    if (isReadOnly) return;
    setSelectedExam(null);
    if (isMultiSelectMode) {
      setSelectedDates((prev) => {
        const exists = prev.some((d) => isSameDay(d, date));
        if (exists) {
          return prev.filter((d) => !isSameDay(d, date));
        } else {
          return [...prev, date];
        }
      });
    } else {
      setSelectedDates([date]);
      setIsModalOpen(true);
    }
  };

  const handleEventClick = (exam: Exam) => {
    setSelectedExam(exam);
    setIsModalOpen(true);
    setSelectedDates([]);
  };

  const handleSaveExam = async (examData: any) => {
    if (!user) return;
    try {
      if (selectedExam) {
        await updateDoc(doc(db, "exams", selectedExam.id), {
          ...examData,
          date: selectedExam.date,
        });
      } else {
        for (const d of selectedDates) {
          await addDoc(collection(db, "exams"), {
            ...examData,
            date: d,
            createdBy: user.uid,
          });
        }
      }
      setIsModalOpen(false);
      setSelectedDates([]);
      setSelectedExam(null);
    } catch (error) {
      console.error("Error saving document: ", error);
    }
  };

  const handleDeleteExam = async () => {
    if (!selectedExam) return;
    try {
      await deleteDoc(doc(db, "exams", selectedExam.id));
      setIsModalOpen(false);
      setSelectedExam(null);
      setSelectedDates([]);
    } catch (error) {
      console.error("Error deleting document: ", error);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#BBC2C9] md:p-4 lg:p-8 items-center justify-center font-sans antialiased">
      <div className="flex w-full h-[100dvh] md:w-[90vw] md:max-w-[90vw] md:h-[90vh] md:min-h-[90vh] bg-white md:rounded-[40px] md:shadow-2xl relative overflow-hidden flex-col md:flex-row">
        
        {/* Sidebar */}
        <CalendarSidebar 
          currentDate={currentDate} 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col bg-white overflow-hidden min-w-0">
          {activeTab === "calendar" ? (
            <CalendarHeader
              currentDate={currentDate}
              onDateChange={setCurrentDate}
              onPrev={handlePrev}
              onNext={handleNext}
              onToday={handleToday}
              view={view}
              onViewChange={setView}
              isMultiSelectMode={isMultiSelectMode}
              onToggleMultiSelect={!isReadOnly ? () => {
                setIsMultiSelectMode(!isMultiSelectMode);
                if (isMultiSelectMode) {
                  setSelectedDates([]);
                }
              } : undefined}
              onToggleMobileMenu={() => setIsMobileMenuOpen(true)}
            />
          ) : (
            <header className="flex h-[80px] md:hidden items-center justify-between px-4 bg-white">
              <div className="w-10 flex items-center justify-start">
                <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 -ml-2 text-gray-800 hover:bg-gray-100 rounded-full">
                  <Menu className="w-6 h-6" />
                </button>
              </div>
              <div className="flex-1 flex justify-center">
                 <h2 className="text-lg font-bold text-gray-800">Exams</h2>
              </div>
              <div className="w-10"></div>
            </header>
          )}
          
          <main className="flex-1 bg-[#E8EAED] md:rounded-tl-[48px] p-4 sm:p-6 md:p-8 overflow-hidden flex flex-col min-h-0">
            {activeTab === "calendar" ? (
              view === "month" ? (
                <MonthView
                  currentDate={currentDate}
                  exams={exams}
                  selectedDates={selectedDates}
                  onDateClick={handleDateClick}
                  onEventClick={handleEventClick}
                  isMultiSelectMode={isMultiSelectMode}
                />
              ) : (
                <WeekView
                  currentDate={currentDate}
                  exams={exams}
                  selectedDates={selectedDates}
                  onDateClick={handleDateClick}
                  onEventClick={handleEventClick}
                />
              )
            ) : (
              <ExamListView 
                exams={exams} 
                onEdit={handleEventClick} 
                onDelete={handleEventClick} 
                isReadOnly={isReadOnly} 
              />
            )}
          </main>
        </div>
      </div>

      {selectedDates.length > 0 && !isModalOpen && (
        <div className="fixed bottom-8 right-8 z-40">
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 rounded-full bg-[#EF4444] px-6 py-3 text-white shadow-[0_4px_12px_-4px_rgba(239,68,68,0.6)] hover:bg-[#DC2626] transition-colors"
          >
            Create Exam ({selectedDates.length} {selectedDates.length === 1 ? 'day' : 'days'})
          </button>
        </div>
      )}

      {isModalOpen && (
        <ExamModal
          date={selectedExam ? (selectedExam.date as Date) : selectedDates[0]}
          dates={selectedDates}
          onClose={() => {
            setIsModalOpen(false);
            if (selectedExam) setSelectedExam(null);
            if (!isMultiSelectMode) setSelectedDates([]);
          }}
          onSave={handleSaveExam}
          onDelete={handleDeleteExam}
          readOnly={isReadOnly}
          existingExam={selectedExam}
        />
      )}
    </div>
  );
}
