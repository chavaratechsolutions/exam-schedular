import { useState } from "react";
import { format } from "date-fns";
import { X, Clock, Users, Copy, AlignLeft, Trash2 } from "lucide-react";

interface ExamModalProps {
  date: Date;
  onClose: () => void;
  onSave: (examData: { examName: string; count: number; shifts: number; description: string; date: Date }) => void;
  onDelete?: () => void;
  readOnly?: boolean;
  existingExam?: any;
  dates?: Date[];
}

export default function ExamModal({ date, dates, onClose, onSave, onDelete, readOnly, existingExam }: ExamModalProps) {
  const [examName, setExamName] = useState(existingExam?.examName || "");
  const [count, setCount] = useState(existingExam?.count?.toString() || "");
  const [shifts, setShifts] = useState(existingExam?.shifts?.toString() || "");
  const [description, setDescription] = useState(existingExam?.description || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!examName || !count || !shifts) return;
    onSave({
      examName,
      count: parseInt(count, 10),
      shifts: parseInt(shifts, 10),
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
            <h2 className="mb-8 text-3xl font-black text-gray-800">{examName}</h2>
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
            <div className="flex items-center gap-4 rounded-xl bg-[#F4F6F9] px-4 py-3.5 focus-within:bg-white focus-within:ring-1 focus-within:ring-gray-300 transition-all">
              <Users className="h-5 w-5 text-gray-500 shrink-0" />
              {!readOnly ? (
                <input
                  type="number"
                  placeholder="System Count"
                  value={count}
                  onChange={(e) => setCount(e.target.value)}
                  className="w-full bg-transparent text-sm font-bold text-gray-800 placeholder-gray-400 focus:outline-none"
                />
              ) : (
                <span className="text-sm font-bold text-gray-700">{count} Systems</span>
              )}
            </div>

            {/* Shifts */}
            <div className="flex items-center gap-4 rounded-xl bg-[#F4F6F9] px-4 py-3.5 focus-within:bg-white focus-within:ring-1 focus-within:ring-gray-300 transition-all">
              <Copy className="h-5 w-5 text-gray-500 shrink-0" />
              {!readOnly ? (
                <input
                  type="number"
                  placeholder="Number of Shifts"
                  value={shifts}
                  onChange={(e) => setShifts(e.target.value)}
                  className="w-full bg-transparent text-sm font-bold text-gray-800 placeholder-gray-400 focus:outline-none"
                />
              ) : (
                <span className="text-sm font-bold text-gray-700">{shifts} Shifts</span>
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
