import { useState, useRef, useEffect } from "react";
import { format } from "date-fns";
import { X, Clock, Users, Copy, AlignLeft, Trash2, MapPin, ChevronDown } from "lucide-react";

interface ExamModalProps {
  date: Date;
  onClose: () => void;
  onSave: (examData: { examName: string; count: number; shifts: number; labs: string[]; description: string; date: Date }) => void;
  onDelete?: () => void;
  readOnly?: boolean;
  existingExam?: any;
  dates?: Date[];
}

export const LAB_DEPARTMENTS = [
  {
    name: "Computer Science & Engineering",
    labs: ["LAB 1", "LAB 2", "LAB 3", "LAB 4", "LAB 5"]
  },
  {
    name: "Mechanical Engineering",
    labs: ["ME LAB"]
  },
  {
    name: "Electrical & Electronics Engineering",
    labs: ["EEE LAB"]
  },
  {
    name: "Civil Engineering",
    labs: ["CIVIL LAB"]
  },
  {
    name: "Other",
    labs: ["CC LAB"]
  }
];

export const ORDERED_LABS = [
  "CC LAB",
  "ME LAB",
  "CIVIL LAB",
  "LAB 1",
  "LAB 4",
  "LAB 2",
  "LAB 3",
  "EEE LAB",
  "LAB 5"
];

export default function ExamModal({ date, dates, onClose, onSave, onDelete, readOnly, existingExam }: ExamModalProps) {
  const [examName, setExamName] = useState(existingExam?.examName || "");
  const [count, setCount] = useState(existingExam?.count?.toString() || "");
  const [shifts, setShifts] = useState(existingExam?.shifts?.toString() || "");
  const [selectedLabs, setSelectedLabs] = useState<string[]>(existingExam?.labs || []);
  const [description, setDescription] = useState(existingExam?.description || "");

  const [isShiftsDropdownOpen, setIsShiftsDropdownOpen] = useState(false);
  const shiftsDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (shiftsDropdownRef.current && !shiftsDropdownRef.current.contains(event.target as Node)) {
        setIsShiftsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleToggleLab = (lab: string) => {
    setSelectedLabs((prev) =>
      prev.includes(lab)
        ? prev.filter((l) => l !== lab)
        : [...prev, lab]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!examName) return;
    onSave({
      examName,
      count: count ? parseInt(count, 10) : 0,
      shifts: shifts ? parseInt(shifts, 10) : 0,
      labs: selectedLabs,
      description,
      date,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-[500px] max-h-[95vh] overflow-y-auto rounded-3xl md:rounded-[32px] bg-white shadow-2xl p-6 md:p-8">
        
        {/* Close Button */}
        <button 
          onClick={onClose} 
          className="absolute top-6 right-6 rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors"
        >
          <X className="h-6 w-6" />
        </button>

        <form onSubmit={handleSubmit} className="mt-4">
          {!readOnly ? (
            <input
              autoFocus
              type="text"
              placeholder="Exam Title"
              value={examName}
              onChange={(e) => setExamName(e.target.value)}
              className="mb-8 w-full bg-transparent text-3xl font-black text-gray-800 placeholder-gray-300 focus:outline-none"
            />
          ) : (
            <h2 className="mb-8 text-3xl font-black text-gray-800">
              {selectedLabs.length ? selectedLabs.join(", ") : "Occupied"}
            </h2>
          )}

          <div className="flex flex-col gap-4">
            
            {/* Date Display */}
            <div className="flex items-center gap-4 rounded-xl bg-[#F4F6F9] px-4 py-3.5">
              <Clock className="h-5 w-5 text-gray-500 shrink-0" />
              <span className="text-sm font-bold text-gray-700">
                {dates && dates.length > 1 
                  ? `${dates.length} days selected: ${dates.map(d => format(d, "MMM d")).join(", ")}`
                  : format(date, "EEEE, MMMM d")}
              </span>
            </div>

            {/* Systems Count */}
            {!readOnly && (
              <div className="flex items-center gap-4 rounded-xl bg-[#F4F6F9] px-4 py-3.5 focus-within:bg-white focus-within:ring-1 focus-within:ring-gray-300 transition-all">
                <Users className="h-5 w-5 text-gray-500 shrink-0" />
                <input
                  type="number"
                  placeholder="System Count"
                  value={count}
                  onChange={(e) => setCount(e.target.value)}
                  className="w-full bg-transparent text-sm font-bold text-gray-800 placeholder-gray-400 focus:outline-none"
                />
              </div>
            )}

            {/* Shifts */}
            {!readOnly && (
              <div className="relative w-full" ref={shiftsDropdownRef}>
                <div 
                  onClick={() => setIsShiftsDropdownOpen(!isShiftsDropdownOpen)}
                  className="flex items-center gap-4 rounded-xl bg-[#F4F6F9] px-4 py-3.5 transition-all cursor-pointer hover:bg-gray-100"
                >
                  <Copy className="h-5 w-5 text-gray-500 shrink-0" />
                  <div className="flex-1 flex justify-between items-center">
                    <span className={`text-sm font-bold ${shifts ? 'text-gray-800' : 'text-gray-400'}`}>
                      {shifts ? `${shifts} Shift${shifts !== "1" ? "s" : ""}` : "Select Number of Shifts"}
                    </span>
                    <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isShiftsDropdownOpen ? 'rotate-180' : ''}`} />
                  </div>
                </div>

                {isShiftsDropdownOpen && (
                  <div className="absolute left-0 right-0 top-full mt-1.5 bg-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100 z-[100] overflow-hidden">
                    <div className="py-1">
                      {["1", "2", "3", "4"].map((option) => (
                        <div 
                          key={option}
                          onClick={() => {
                            setShifts(option);
                            setIsShiftsDropdownOpen(false);
                          }}
                          className={`px-5 py-3 text-sm font-bold cursor-pointer hover:bg-red-50 hover:text-[#EF4444] transition-colors ${
                            shifts === option ? 'bg-red-50 text-[#EF4444]' : 'text-gray-600'
                          }`}
                        >
                          {option} Shift{option !== "1" ? "s" : ""}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Labs */}
            <div className="flex flex-col gap-2 rounded-xl bg-[#F4F6F9] px-4 py-3.5 transition-all">
              <div className="flex items-center gap-4">
                <MapPin className="h-5 w-5 text-gray-500 shrink-0" />
                <span className="text-sm font-bold text-gray-500">Select Labs</span>
              </div>
              {!readOnly ? (
                <div className="flex flex-wrap gap-2 mt-2">
                  {ORDERED_LABS.map((lab) => {
                    const isSelected = selectedLabs.includes(lab);
                    return (
                      <button
                        key={lab}
                        type="button"
                        onClick={() => handleToggleLab(lab)}
                        className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${
                          isSelected
                            ? "bg-[#EF4444] border-[#EF4444] text-white shadow-sm"
                            : "bg-white border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        {lab}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="flex flex-wrap gap-2 mt-1">
                  {selectedLabs.length > 0 ? (
                    selectedLabs.map((lab) => (
                      <span
                        key={lab}
                        className="px-3 py-1.5 rounded-full text-xs font-bold bg-white text-gray-700 border border-gray-200 shadow-sm"
                      >
                        {lab}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm font-bold text-gray-700">No labs selected</span>
                  )}
                </div>
              )}
            </div>
            
            {/* Description */}
            <div className="flex items-start gap-4 rounded-xl bg-[#F4F6F9] px-4 py-3.5 focus-within:bg-white focus-within:ring-1 focus-within:ring-gray-300 transition-all">
               <AlignLeft className="mt-1 h-5 w-5 text-gray-500 shrink-0" />
               {!readOnly ? (
                 <textarea
                   placeholder="Add a description"
                   value={description}
                   onChange={(e) => setDescription(e.target.value)}
                   rows={3}
                   className="w-full resize-none bg-transparent text-sm font-bold text-gray-800 placeholder-gray-400 focus:outline-none"
                 />
               ) : (
                 <span className="text-sm font-bold text-gray-700 whitespace-pre-wrap">{description || "No description provided."}</span>
               )}
            </div>
          </div>

          {!readOnly && (
            <div className="mt-8 flex justify-end gap-3">
              {existingExam && onDelete && (
                <button
                  type="button"
                  onClick={onDelete}
                  className="flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-bold text-red-500 hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </button>
              )}
              <button
                type="submit"
                className="rounded-xl bg-[#EF4444] px-8 py-3 text-sm font-bold text-white shadow-md hover:bg-[#DC2626] transition-colors focus:outline-none focus:ring-2 focus:ring-[#EF4444] focus:ring-offset-2"
              >
                Save
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
