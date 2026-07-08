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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-[450px] rounded-lg bg-white dark:bg-gray-900 shadow-2xl border dark:border-gray-700">
        <div className="flex items-center justify-between rounded-t-lg bg-gray-50 dark:bg-gray-800 px-4 py-2">
          <button className="rounded-full p-2 hover:bg-gray-200 dark:hover:bg-gray-700">
             {/* drag handle could go here */}
          </button>
          <button onClick={onClose} className="rounded-full p-2 hover:bg-gray-200 dark:hover:bg-gray-700">
            <X className="h-5 w-5 text-google-text dark:text-gray-300" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {!readOnly ? (
            <input
              autoFocus
              type="text"
              placeholder="Add exam title"
              value={examName}
              onChange={(e) => setExamName(e.target.value)}
              className="mb-6 w-full border-b-2 border-transparent bg-transparent text-2xl text-google-text dark:text-gray-100 placeholder-gray-400 focus:border-google-blue focus:outline-none"
            />
          ) : (
            <h2 className="mb-6 text-2xl text-google-text dark:text-gray-100">{examName}</h2>
          )}

          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <Clock className="h-5 w-5 text-google-textLight dark:text-gray-400" />
              <span className="text-sm font-medium text-google-text dark:text-gray-200">
                {dates && dates.length > 1 
                  ? `${dates.length} days selected: ${dates.map(d => format(d, "MMM d")).join(", ")}`
                  : format(date, "EEEE, MMMM d")}
              </span>
            </div>

            <div className="flex items-center gap-4">
              <Users className="h-5 w-5 text-google-textLight dark:text-gray-400" />
              {!readOnly ? (
                <input
                  type="number"
                  placeholder="Student Count"
                  value={count}
                  onChange={(e) => setCount(e.target.value)}
                  className="w-full rounded bg-gray-100 dark:bg-gray-800 px-3 py-1.5 text-sm dark:text-gray-200 focus:bg-white dark:focus:bg-gray-700 focus:outline-none focus:ring-1 focus:ring-google-blue"
                />
              ) : (
                <span className="text-sm text-google-text dark:text-gray-200">{count} Students</span>
              )}
            </div>

            <div className="flex items-center gap-4">
              <Copy className="h-5 w-5 text-google-textLight dark:text-gray-400" />
              {!readOnly ? (
                <input
                  type="number"
                  placeholder="Number of Shifts"
                  value={shifts}
                  onChange={(e) => setShifts(e.target.value)}
                  className="w-full rounded bg-gray-100 dark:bg-gray-800 px-3 py-1.5 text-sm dark:text-gray-200 focus:bg-white dark:focus:bg-gray-700 focus:outline-none focus:ring-1 focus:ring-google-blue"
                />
              ) : (
                <span className="text-sm text-google-text dark:text-gray-200">{shifts} Shifts</span>
              )}
            </div>
            
            <div className="flex items-start gap-4">
               <AlignLeft className="mt-1.5 h-5 w-5 text-google-textLight dark:text-gray-400" />
               {!readOnly ? (
                 <textarea
                   placeholder="Add description"
                   value={description}
                   onChange={(e) => setDescription(e.target.value)}
                   rows={3}
                   className="w-full resize-none rounded bg-gray-100 dark:bg-gray-800 px-3 py-1.5 text-sm dark:text-gray-200 focus:bg-white dark:focus:bg-gray-700 focus:outline-none focus:ring-1 focus:ring-google-blue"
                 />
               ) : (
                 <span className="text-sm text-google-text dark:text-gray-200">{description || "No description provided."}</span>
               )}
            </div>
          </div>

          {!readOnly && (
            <div className="mt-8 flex justify-end gap-3">
              {existingExam && onDelete && (
                <button
                  type="button"
                  onClick={onDelete}
                  className="flex items-center gap-2 rounded px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </button>
              )}
              <button
                type="submit"
                className="rounded bg-google-blue px-6 py-2 text-sm font-medium text-white hover:bg-google-blueHover"
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
