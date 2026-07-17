import { Exam } from "../../types";
import { format } from "date-fns";
import { FileText, Calendar as CalendarIcon, Clock, Users, Edit2, Trash2 } from "lucide-react";
import { useState } from "react";

interface ExamListViewProps {
  exams: Exam[];
  onEdit?: (exam: Exam) => void;
  onDelete?: (exam: Exam) => void;
  isReadOnly?: boolean;
}

export default function ExamListView({ exams, onEdit, onDelete, isReadOnly = false }: ExamListViewProps) {
  const [filterType, setFilterType] = useState<"upcoming" | "all">("upcoming");

  // Sort exams by date ascending
  const sortedExams = [...exams].sort((a, b) => a.date.getTime() - b.date.getTime());

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const filteredExams = sortedExams.filter(exam => {
    if (filterType === "all") return true;
    return exam.date >= today;
  });

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="bg-white px-4 md:px-5 min-[2000px]:px-8 py-3 md:py-4 min-[2000px]:py-6 rounded-[12px] md:rounded-[16px] min-[2000px]:rounded-[24px] shadow-sm mb-3 md:mb-4 min-[2000px]:mb-6 shrink-0 flex flex-col sm:flex-row items-center justify-between gap-3 md:gap-4">
        <div className="text-center sm:text-left">
          <h2 className="text-base md:text-lg min-[2000px]:text-2xl font-black text-gray-800 tracking-tight">
            {filterType === "upcoming" ? "Upcoming Exams" : "All Scheduled Exams"}
          </h2>
          <p className="text-gray-500 text-[10px] md:text-xs min-[2000px]:text-sm font-medium mt-0.5 md:mt-1">Showing {filteredExams.length} exam{filteredExams.length !== 1 ? 's' : ''}</p>
        </div>
        
        <div className="flex bg-[#F5F6F8] p-1.5 rounded-[20px] w-full sm:w-auto">
          <button
            onClick={() => setFilterType("upcoming")}
            className={`flex-1 sm:flex-none px-4 sm:px-6 py-2.5 rounded-[16px] text-xs sm:text-sm font-bold transition-all ${
              filterType === "upcoming"
                ? "bg-[#EF4444] text-white shadow-[0_4px_12px_-4px_rgba(239,68,68,0.6)]"
                : "text-gray-500 hover:text-gray-800"
            }`}
          >
            Upcoming
          </button>
          <button
            onClick={() => setFilterType("all")}
            className={`flex-1 sm:flex-none px-4 sm:px-6 py-2.5 rounded-[16px] text-xs sm:text-sm font-bold transition-all ${
              filterType === "all"
                ? "bg-[#EF4444] text-white shadow-[0_4px_12px_-4px_rgba(239,68,68,0.6)]"
                : "text-gray-500 hover:text-gray-800"
            }`}
          >
            All Exams
          </button>
        </div>
      </div>

      {filteredExams.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center bg-transparent h-full text-gray-400 min-h-0">
          <div className="bg-white p-12 rounded-[32px] flex flex-col items-center shadow-sm">
            <FileText className="w-16 h-16 mb-4 text-gray-200" />
            <h2 className="text-xl font-bold text-gray-500">No Exams Found</h2>
            <p className="mt-2 text-sm">There are no {filterType === "upcoming" ? "upcoming " : ""}exams to display.</p>
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto no-scrollbar min-h-0 pb-4 md:pb-6 pr-2">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4 min-[2000px]:gap-6">
            {filteredExams.map((exam) => {
              const isPast = exam.date.getTime() < today.getTime();
              return (
              <div 
                key={exam.id}
                className={`p-3 md:p-4 min-[2000px]:p-6 rounded-[12px] md:rounded-[16px] min-[2000px]:rounded-[24px] shadow-sm hover:shadow-md transition-shadow border-2 flex flex-col min-h-[160px] md:min-h-[180px] min-[2000px]:min-h-[220px] ${
                  isPast
                    ? "bg-[repeating-linear-gradient(45deg,#e5e7eb,#e5e7eb_10px,#f9fafb_10px,#f9fafb_20px)] border-gray-200 hover:border-gray-300 opacity-90"
                    : "bg-white border-transparent hover:border-red-100"
                }`}
              >
                <div className="flex justify-between items-start mb-2 md:mb-3 min-[2000px]:mb-4">
                  <h3 className="font-bold text-[#EF4444] text-base md:text-lg min-[2000px]:text-2xl leading-tight line-clamp-2" title={isReadOnly ? format(exam.date, "EEEE, MMMM d, yyyy") : exam.examName}>
                    {isReadOnly ? format(exam.date, "EEEE, MMMM d, yyyy") : exam.examName}
                  </h3>
                  {!isReadOnly && (
                    <div className="flex gap-2 ml-2 shrink-0">
                      <button
                        onClick={(e) => { e.stopPropagation(); onEdit?.(exam); }}
                        className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit exam"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); onDelete?.(exam); }}
                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete exam"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-2 md:gap-2.5 min-[2000px]:gap-3 flex-1">
                  <div className={`flex text-[10px] md:text-xs min-[2000px]:text-sm font-bold text-gray-600 bg-[#F5F6F8] rounded-[10px] md:rounded-[12px] min-[2000px]:rounded-[16px] px-2.5 md:px-3 min-[2000px]:px-4 py-2 md:py-2.5 min-[2000px]:py-3 ${isReadOnly ? 'items-start' : 'items-center'}`}>
                    {isReadOnly ? (
                      <>
                        <span className="material-symbols-outlined mr-2 md:mr-2.5 min-[2000px]:mr-3 mt-0.5 text-[#EF4444] shrink-0 text-[16px] md:text-[18px] min-[2000px]:text-[20px]">desktop_mac</span>
                        <div className="flex flex-wrap gap-1 md:gap-1.5 flex-1">
                          {exam.labs?.length ? (
                            exam.labs.map((lab) => (
                              <span key={lab} className="px-1.5 py-0.5 md:px-2 md:py-1 min-[2000px]:px-2.5 min-[2000px]:py-1 text-[8px] md:text-[9px] min-[2000px]:text-[11px] font-bold bg-white text-gray-700 rounded-[4px] md:rounded-[6px] min-[2000px]:rounded-[8px] border border-gray-200 shadow-sm">
                                {lab}
                              </span>
                            ))
                          ) : (
                            <span className="mt-0.5">Occupied</span>
                          )}
                        </div>
                      </>
                    ) : (
                      <>
                        <CalendarIcon className="w-5 h-5 mr-3 text-[#EF4444] shrink-0" />
                        {format(exam.date, "EEEE, MMMM d, yyyy")}
                      </>
                    )}
                  </div>

                  {!isReadOnly && (
                    <div className="flex gap-2 md:gap-2.5 min-[2000px]:gap-3">
                      <div className="flex-1 flex items-center justify-center text-[10px] md:text-xs min-[2000px]:text-sm font-bold text-gray-700 bg-red-50 rounded-[10px] md:rounded-[12px] min-[2000px]:rounded-[16px] py-2 md:py-2.5 min-[2000px]:py-3 border border-red-100">
                        <Clock className="w-3 h-3 md:w-3.5 md:h-3.5 min-[2000px]:w-4 min-[2000px]:h-4 mr-1 md:mr-1.5 min-[2000px]:mr-2 text-[#EF4444]" />
                        {exam.shifts} Shift{exam.shifts !== 1 ? 's' : ''}
                      </div>
                      <div className="flex-1 flex items-center justify-center text-[10px] md:text-xs min-[2000px]:text-sm font-bold text-gray-700 bg-red-50 rounded-[10px] md:rounded-[12px] min-[2000px]:rounded-[16px] py-2 md:py-2.5 min-[2000px]:py-3 border border-red-100">
                        <Users className="w-3 h-3 md:w-3.5 md:h-3.5 min-[2000px]:w-4 min-[2000px]:h-4 mr-1 md:mr-1.5 min-[2000px]:mr-2 text-[#EF4444]" />
                        {exam.count} Systems
                      </div>
                    </div>
                  )}

                  {exam.labs && exam.labs.length > 0 && !isReadOnly && (
                    <div className="flex flex-wrap gap-1 md:gap-1.5 p-2 md:p-2.5 min-[2000px]:p-3 bg-gray-50 rounded-[10px] md:rounded-[12px] min-[2000px]:rounded-[16px] border border-gray-100">
                      {exam.labs.map((lab) => (
                        <span key={lab} className="px-1.5 py-0.5 md:px-2 md:py-1 min-[2000px]:px-2.5 min-[2000px]:py-1 text-[8px] md:text-[9px] min-[2000px]:text-[11px] font-bold bg-white text-gray-700 rounded-[4px] md:rounded-[6px] min-[2000px]:rounded-[8px] border border-gray-200 shadow-sm">
                          {lab}
                        </span>
                      ))}
                    </div>
                  )}

                  {exam.description && (
                    <div className="mt-2 text-xs font-medium text-gray-500 bg-[#F5F6F8] rounded-[16px] p-4 flex-1">
                      {exam.description}
                    </div>
                  )}
                </div>
              </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
