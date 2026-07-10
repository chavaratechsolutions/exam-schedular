import { Exam } from "../../types";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Clock, Users, RotateCcw, Trash2, Trash } from "lucide-react";

interface TrashViewProps {
  exams: Exam[];
  onRestore: (examId: string) => void;
  onDeletePermanent: (examId: string) => void;
  isReadOnly?: boolean;
}

export default function TrashView({ exams, onRestore, onDeletePermanent, isReadOnly = false }: TrashViewProps) {
  // Sort exams by date ascending
  const sortedExams = [...exams].sort((a, b) => a.date.getTime() - b.date.getTime());

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Header Info */}
      <div className="bg-white px-5 md:px-8 py-5 md:py-6 rounded-[20px] md:rounded-[24px] shadow-sm mb-4 md:mb-6 shrink-0 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-center sm:text-left">
          <h2 className="text-xl md:text-2xl font-black text-gray-800 tracking-tight">
            Trash Bin
          </h2>
          <p className="text-gray-500 text-sm font-medium mt-1">
            Showing {sortedExams.length} deleted exam{sortedExams.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* Grid of deleted exams */}
      {sortedExams.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center bg-transparent h-full text-gray-400 min-h-0">
          <div className="bg-white p-12 rounded-[32px] flex flex-col items-center shadow-sm">
            <Trash className="w-16 h-16 mb-4 text-gray-200" />
            <h2 className="text-xl font-bold text-gray-500">Trash is Empty</h2>
            <p className="mt-2 text-sm">Deleted exams will appear here. You can restore them anytime.</p>
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto no-scrollbar min-h-0 pb-6 pr-2">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedExams.map((exam) => (
              <div 
                key={exam.id}
                className="bg-white p-6 rounded-[24px] shadow-sm border-2 border-transparent hover:border-gray-200 flex flex-col min-h-[220px] opacity-80 hover:opacity-100 transition-opacity"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-bold text-gray-500 text-xl leading-tight line-clamp-2" title={exam.examName}>
                    {exam.examName}
                  </h3>
                  {!isReadOnly && (
                    <div className="flex gap-2 ml-2 shrink-0">
                      <button
                        onClick={() => onRestore(exam.id)}
                        className="p-2 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-xl transition-colors flex items-center gap-1 text-xs font-bold border border-green-100"
                        title="Restore exam"
                      >
                        <RotateCcw className="w-4 h-4" />
                        Restore
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm("Are you sure you want to permanently delete this exam? This action cannot be undone.")) {
                            onDeletePermanent(exam.id);
                          }
                        }}
                        className="p-2 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                        title="Delete permanently"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-3 flex-1">
                  <div className="flex items-center text-sm font-bold text-gray-500 bg-[#F5F6F8] rounded-[16px] px-4 py-3">
                    <CalendarIcon className="w-5 h-5 mr-3 text-gray-400" />
                    {format(exam.date, "EEEE, MMMM d, yyyy")}
                  </div>

                  <div className="flex gap-3">
                    <div className="flex-1 flex items-center justify-center text-sm font-bold text-gray-500 bg-gray-50 rounded-[16px] py-3 border border-gray-100">
                      <Clock className="w-4 h-4 mr-2 text-gray-400" />
                      {exam.shifts} Shift{exam.shifts !== 1 ? 's' : ''}
                    </div>
                    <div className="flex-1 flex items-center justify-center text-sm font-bold text-gray-500 bg-gray-50 rounded-[16px] py-3 border border-gray-100">
                      <Users className="w-4 h-4 mr-2 text-gray-400" />
                      {exam.count} Systems
                    </div>
                  </div>

                  {exam.labs && exam.labs.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 p-3 bg-gray-50 rounded-[16px] border border-gray-100">
                      {exam.labs.map((lab) => (
                        <span key={lab} className="px-2.5 py-1 text-[10px] font-bold bg-white text-gray-500 rounded-[8px] border border-gray-200 shadow-sm">
                          {lab}
                        </span>
                      ))}
                    </div>
                  )}

                  {exam.description && (
                    <div className="mt-2 text-xs font-medium text-gray-400 bg-gray-50 rounded-[16px] p-4 flex-1">
                      {exam.description}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
