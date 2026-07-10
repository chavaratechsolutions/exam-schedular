import { format, isSameMonth, isSameDay, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays } from "date-fns";
import { Exam } from "../../types";
import { CheckCircle2, Plus } from "lucide-react";

interface MonthViewProps {
  currentDate: Date;
  exams: Exam[];
  onDateClick: (date: Date) => void;
  onEventClick: (exam: Exam) => void;
  selectedDates?: Date[];
  isMultiSelectMode?: boolean;
}

export default function MonthView({ currentDate, exams, onDateClick, onEventClick, selectedDates = [], isMultiSelectMode = false }: MonthViewProps) {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const dateFormat = "dd";
  const days = [];
  let day = startDate;

  while (day <= endDate) {
    for (let i = 0; i < 7; i++) {
      const formattedDate = format(day, dateFormat);
      const cloneDay = day;

      const dayExams = exams.filter((exam) => isSameDay(new Date(exam.date), cloneDay));
      const isCurrentMonth = isSameMonth(day, monthStart);
      const isSelected = selectedDates.some(d => isSameDay(d, cloneDay));

      const hasExams = dayExams.length > 0;

      days.push(
        <div
          key={day.toString()}
          onClick={() => onDateClick(cloneDay)}
          className={`relative flex flex-col rounded-[16px] md:rounded-[24px] p-1 sm:p-3 transition-all duration-200 cursor-pointer shadow-sm min-h-0 ${!isMultiSelectMode ? 'group hover:z-50' : ''} ${
            isCurrentMonth 
              ? isSelected 
                  ? "bg-red-50 border-2 border-[#EF4444]" 
                  : hasExams
                      ? "bg-white hover:shadow-md border-2 border-[#EF4444]"
                      : "bg-white hover:shadow-md border-2 border-transparent"
              : "bg-white/40 text-gray-400 border-2 border-transparent"
          }`}
        >
          {isSelected && (
            <CheckCircle2 className="absolute top-3 right-3 w-5 h-5 text-[#EF4444] fill-red-100" />
          )}
          <div className="flex justify-center items-center h-8 md:h-10 w-full mb-1 md:mb-2 shrink-0">
            <span
              className={`text-sm md:text-lg font-bold ${
                isSameDay(day, new Date())
                  ? "text-[#EF4444]"
                  : isCurrentMonth ? "text-gray-700" : "text-gray-400"
              }`}
            >
              {formattedDate}
            </span>
          </div>
          <div className={`flex-1 flex flex-row flex-wrap justify-center content-start gap-1 md:gap-1.5 overflow-y-auto no-scrollbar min-h-0 ${!isMultiSelectMode ? 'md:group-hover:opacity-0 transition-opacity duration-200' : ''}`}>
            {dayExams.map((exam) => (
              <div
                key={exam.id}
                onClick={(e) => {
                  e.stopPropagation();
                  onEventClick(exam);
                }}
                className="cursor-pointer rounded-lg md:rounded-xl bg-red-100/80 px-1.5 py-1 md:px-2.5 md:py-1.5 hover:bg-red-200 transition-colors flex flex-col items-center text-center min-w-0 max-w-full"
              >
                <span className="text-[9px] md:text-[11px] font-bold text-[#EF4444] truncate w-full leading-tight">
                  {exam.examName}
                </span>
                <span className="hidden md:block text-[10px] font-semibold text-[#DC2626] truncate w-full leading-tight mt-0.5">
                  {exam.shifts} shifts
                </span>
              </div>
            ))}
          </div>

          {hasExams && !isMultiSelectMode && (
            <div className="hidden md:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[145%] bg-white border border-red-200 rounded-[24px] shadow-2xl z-50 flex-col p-5 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-300 scale-95 group-hover:scale-100 h-fit">
               <div className="text-center font-black text-xl text-[#EF4444] mb-3">{formattedDate}</div>
               <div className="flex-1 overflow-visible flex flex-col gap-2">
                  {dayExams.map(exam => (
                    <div 
                      key={`hover-${exam.id}`} 
                      onClick={(e) => { e.stopPropagation(); onEventClick(exam); }}
                      className="bg-red-50 p-4 rounded-[16px] flex flex-col gap-2 border border-red-100 hover:bg-red-100 transition-colors cursor-pointer"
                    >
                      <div className="font-bold text-[#EF4444] text-base leading-tight">{exam.examName}</div>
                      <div className="flex justify-between items-center text-[13px] font-semibold text-[#DC2626]">
                        <span>{exam.shifts} Shifts</span>
                        <span>{exam.count} Systems</span>
                      </div>
                      {exam.labs && exam.labs.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-0.5">
                          {exam.labs.map(lab => (
                            <span key={lab} className="px-2 py-0.5 text-[9px] font-bold bg-white text-[#EF4444] rounded border border-red-100 shadow-sm">
                              {lab}
                            </span>
                          ))}
                        </div>
                      )}
                      {exam.description && (
                        <div className="text-xs text-red-400 mt-1 line-clamp-2">{exam.description}</div>
                      )}
                    </div>
                  ))}
               </div>
               <button 
                 onClick={(e) => { e.stopPropagation(); onDateClick(cloneDay); }}
                 className="mt-3 flex items-center justify-center w-full bg-red-50 hover:bg-red-100 text-[#EF4444] rounded-xl py-2 font-bold transition-colors border border-red-200"
               >
                 <Plus className="w-5 h-5" />
               </button>
            </div>
          )}
        </div>
      );
      day = addDays(day, 1);
    }
  }

  const weekDays = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  const weeks = days.length / 7;

  return (
    <div className="flex h-full flex-col min-h-0">
      <div className="grid grid-cols-7 gap-2 md:gap-4 mb-2 md:mb-4">
        {weekDays.map((wd, i) => (
          <div 
            key={i} 
            className={`bg-white rounded-[12px] md:rounded-[16px] py-2 md:py-4 text-center text-[10px] md:text-xs font-black shadow-sm ${
              i === 0 || i === 6 ? "text-[#EF4444]" : "text-gray-500"
            }`}
          >
            {wd}
          </div>
        ))}
      </div>
      <div 
        className="grid flex-1 grid-cols-7 gap-1 sm:gap-2 md:gap-4 min-h-0"
        style={{ gridTemplateRows: `repeat(${weeks}, minmax(0, 1fr))` }}
      >
        {days}
      </div>
    </div>
  );
}
