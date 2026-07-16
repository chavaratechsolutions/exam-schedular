import { format, addDays, startOfWeek, isSameDay } from "date-fns";
import { Exam } from "../../types";

interface WeekViewProps {
  currentDate: Date;
  exams: Exam[];
  onDateClick: (date: Date) => void;
  onEventClick: (exam: Exam) => void;
  selectedDates?: Date[];
  isReadOnly?: boolean;
}

export default function WeekView({ currentDate, exams, onDateClick, onEventClick, selectedDates = [], isReadOnly = false }: WeekViewProps) {
  const startDate = startOfWeek(currentDate);
  const weekDays = Array.from({ length: 7 }).map((_, i) => addDays(startDate, i));
  const hours = Array.from({ length: 24 }).map((_, i) => i);
  const todayTime = new Date().setHours(0, 0, 0, 0);

  return (
    <div className="flex h-full flex-col overflow-auto">
      <div className="min-w-[600px] flex flex-col flex-1 h-full">
        <div className="sticky top-0 z-10 flex border-b border-google-border dark:border-gray-700 bg-white dark:bg-gray-900">
          <div className="w-16 border-r border-google-border dark:border-gray-700" /> {/* Time column header */}
          <div className="flex flex-1">
          {weekDays.map((day, i) => (
            <div key={i} className="flex flex-1 flex-col items-center border-r border-google-border dark:border-gray-700 py-2">
              <span className="text-xs font-medium text-google-textLight dark:text-gray-400">{format(day, "EEE")}</span>
              <span
                className={`mt-1 flex h-10 w-10 items-center justify-center rounded-full text-2xl font-normal ${
                  isSameDay(day, new Date())
                    ? "bg-google-blue text-white"
                    : selectedDates.some(d => isSameDay(d, day)) 
                      ? "bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300"
                      : "text-google-text dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
              >
                {format(day, "d")}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-1">
        <div className="w-16 flex-none bg-white dark:bg-gray-900">
          {hours.map((hour) => (
            <div key={hour} className="relative h-14 border-b border-transparent">
              <span className="absolute -top-3 right-2 text-xs text-google-textLight dark:text-gray-400">
                {hour === 0 ? "" : format(new Date().setHours(hour, 0), "h a")}
              </span>
            </div>
          ))}
        </div>
        <div className="flex flex-1">
          {weekDays.map((day, i) => {
            const dayExams = exams.filter((exam) => isSameDay(new Date(exam.date), day));
            const isSelected = selectedDates.some(d => isSameDay(d, day));
            const isPastDate = day.getTime() < todayTime;
            const hasExams = dayExams.length > 0;
            return (
              <div key={i} className={`relative flex-1 border-r border-google-border dark:border-gray-700 ${
                isSelected 
                  ? 'bg-blue-50/50 dark:bg-blue-900/10' 
                  : (isPastDate && hasExams)
                      ? 'bg-[repeating-linear-gradient(45deg,#e5e7eb,#e5e7eb_10px,#f9fafb_10px,#f9fafb_20px)]' 
                      : ''
              }`}>
                {hours.map((hour) => (
                  <div
                    key={hour}
                    onClick={() => {
                      const newDate = new Date(day);
                      newDate.setHours(hour);
                      onDateClick(newDate);
                    }}
                    className="h-14 border-b border-google-border/50 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-800"
                  />
                ))}
                
                {/* Render Events */}
                {dayExams.map((exam, idx) => (
                  <div
                    key={exam.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      onEventClick(exam);
                    }}
                    // Note: for a simple layout, we are just stacking them at the top. 
                    // In a real Google Calendar week view, they are positioned absolutely by hour.
                    // Assuming exams don't have time yet, we place them at the top as "All day" events or 8 AM.
                    className="absolute left-1 right-1 top-[20px] mt-1 cursor-pointer truncate rounded bg-google-blue px-2 py-1 text-xs font-medium text-white shadow-sm hover:bg-google-blueHover"
                    style={{ top: `${(idx + 1) * 30}px` }} // simple stagger
                  >
                    {isReadOnly 
                      ? (exam.labs?.length ? exam.labs.join(", ") : "Occupied")
                      : `${exam.examName} (${exam.shifts} shifts)${exam.labs?.length ? ` - ${exam.labs.join(", ")}` : ""}`
                    }
                  </div>
                ))}
              </div>
            );
          })}
        </div>
        </div>
      </div>
    </div>
  );
}
