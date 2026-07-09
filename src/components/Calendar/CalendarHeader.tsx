import { useState, useRef, useEffect } from "react";
import { Bell, Grid, User, ChevronDown, ChevronLeft, ChevronRight, Menu, CheckSquare } from "lucide-react";
import { format, setMonth, setYear } from "date-fns";
import { useAuth } from "../../context/AuthContext";

interface CalendarHeaderProps {
  currentDate: Date;
  onDateChange?: (date: Date) => void;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
  view: "month" | "week";
  onViewChange: (view: "month" | "week") => void;
  isMultiSelectMode?: boolean;
  onToggleMultiSelect?: () => void;
  onToggleMobileMenu?: () => void;
}

export default function CalendarHeader({
  currentDate,
  onDateChange,
  onPrev,
  onNext,
  onToday,
  view,
  onViewChange,
  isMultiSelectMode,
  onToggleMultiSelect,
  onToggleMobileMenu,
}: CalendarHeaderProps) {
  const { signOut } = useAuth();
  
  const currentMonth = format(currentDate, "MMMM");
  const currentYear = format(currentDate, "yyyy");

  const [isMonthDropdownOpen, setIsMonthDropdownOpen] = useState(false);
  const [isYearDropdownOpen, setIsYearDropdownOpen] = useState(false);
  
  const monthDropdownRef = useRef<HTMLDivElement>(null);
  const yearDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (monthDropdownRef.current && !monthDropdownRef.current.contains(event.target as Node)) {
        setIsMonthDropdownOpen(false);
      }
      if (yearDropdownRef.current && !yearDropdownRef.current.contains(event.target as Node)) {
        setIsYearDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const months = Array.from({ length: 12 }, (_, i) => ({ value: i, label: format(new Date(2000, i, 1), "MMMM") }));
  const years = Array.from({ length: 10 }, (_, i) => { const y = new Date().getFullYear() - 5 + i; return { value: y, label: y.toString() } });

  return (
    <header className="flex h-[80px] md:h-[100px] items-center justify-between px-4 md:px-8 bg-white md:pr-10">
      {/* Mobile Menu Toggle */}
      <div className="md:hidden w-10 flex items-center justify-start">
        <button onClick={onToggleMobileMenu} className="p-2 -ml-2 text-gray-800 hover:bg-gray-100 rounded-full">
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Left: View Toggles */}
      <div className="hidden md:flex bg-[#F5F6F8] rounded-[24px] p-1.5">
        <button 
          className="px-6 py-2.5 rounded-[20px] text-sm font-bold text-gray-500 hover:text-gray-800 transition-colors"
        >
          Year
        </button>
        <button 
          onClick={() => onViewChange("month")}
          className={`px-6 py-2.5 rounded-[20px] text-sm font-bold transition-all ${
            view === "month" 
              ? "bg-[#EF4444] text-white shadow-[0_4px_12px_-4px_rgba(239,68,68,0.6)]" 
              : "text-gray-500 hover:text-gray-800"
          }`}
        >
          Month
        </button>
        <button 
          onClick={() => onViewChange("week")}
          className={`px-6 py-2.5 rounded-[20px] text-sm font-bold transition-all ${
            view === "week" 
              ? "bg-[#EF4444] text-white shadow-[0_4px_12px_-4px_rgba(239,68,68,0.6)]" 
              : "text-gray-500 hover:text-gray-800"
          }`}
        >
          Week
        </button>
      </div>

      {/* Middle: Date Navigation & Dropdowns */}
      <div className="flex items-center justify-center gap-1 sm:gap-3 flex-1 md:flex-none">
        {/* Today Button */}
        <button
          onClick={onToday}
          className="mr-1 sm:mr-2 px-3 sm:px-4 py-2 rounded-[16px] text-xs sm:text-sm font-bold bg-[#F5F6F8] text-gray-600 hover:bg-gray-200 transition-all"
        >
          Today
        </button>

        {/* Navigation Arrows */}
        <button onClick={onPrev} className="p-2 rounded-full hover:bg-gray-100 text-gray-600">
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Month Dropdown */}
        <div className="relative" ref={monthDropdownRef}>
          <div 
            onClick={() => { setIsMonthDropdownOpen(!isMonthDropdownOpen); setIsYearDropdownOpen(false); }}
            className="flex items-center gap-1 sm:gap-2 bg-[#F5F6F8] px-3 sm:px-4 py-2 sm:py-2.5 rounded-[16px] cursor-pointer hover:bg-gray-200 transition-colors"
          >
            <span className="text-xs sm:text-sm font-bold text-gray-700">{currentMonth}</span>
            <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isMonthDropdownOpen ? 'rotate-180' : ''}`} />
          </div>
          
          {isMonthDropdownOpen && (
            <div className="absolute top-full mt-2 w-48 bg-white rounded-[16px] shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100 z-50 overflow-hidden left-1/2 -translate-x-1/2 sm:left-auto sm:translate-x-0">
              <div className="max-h-60 overflow-y-auto py-2">
                {months.map((m) => (
                  <div 
                    key={m.value}
                    onClick={() => {
                      onDateChange?.(setMonth(currentDate, m.value));
                      setIsMonthDropdownOpen(false);
                    }}
                    className={`px-5 py-2.5 text-sm font-bold cursor-pointer hover:bg-red-50 hover:text-[#EF4444] transition-colors ${currentDate.getMonth() === m.value ? 'bg-red-50 text-[#EF4444]' : 'text-gray-600'}`}
                  >
                    {m.label}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Year Dropdown */}
        <div className="relative" ref={yearDropdownRef}>
          <div 
            onClick={() => { setIsYearDropdownOpen(!isYearDropdownOpen); setIsMonthDropdownOpen(false); }}
            className="flex items-center gap-1 sm:gap-2 bg-[#F5F6F8] px-3 sm:px-4 py-2 sm:py-2.5 rounded-[16px] cursor-pointer hover:bg-gray-200 transition-colors"
          >
            <span className="text-xs sm:text-sm font-bold text-gray-700">{currentYear}</span>
            <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isYearDropdownOpen ? 'rotate-180' : ''}`} />
          </div>
          
          {isYearDropdownOpen && (
            <div className="absolute top-full mt-2 w-32 bg-white rounded-[16px] shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100 z-50 overflow-hidden left-1/2 -translate-x-1/2 sm:left-auto sm:translate-x-0">
              <div className="max-h-60 overflow-y-auto py-2">
                {years.map((y) => (
                  <div 
                    key={y.value}
                    onClick={() => {
                      onDateChange?.(setYear(currentDate, y.value));
                      setIsYearDropdownOpen(false);
                    }}
                    className={`px-5 py-2.5 text-sm font-bold cursor-pointer hover:bg-red-50 hover:text-[#EF4444] transition-colors ${currentDate.getFullYear() === y.value ? 'bg-red-50 text-[#EF4444]' : 'text-gray-600'}`}
                  >
                    {y.label}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <button onClick={onNext} className="p-2 rounded-full hover:bg-gray-100 text-gray-600">
          <ChevronRight className="w-5 h-5" />
        </button>

        {onToggleMultiSelect && (
          <button
            onClick={onToggleMultiSelect}
            className={`ml-1 sm:ml-2 p-2 md:px-4 md:py-2 rounded-[16px] text-sm font-bold transition-all flex items-center gap-2 ${
              isMultiSelectMode
                ? "bg-[#EF4444] text-white shadow-[0_4px_12px_-4px_rgba(239,68,68,0.6)]"
                : "bg-[#F5F6F8] text-gray-600 hover:bg-gray-200"
            }`}
            title={isMultiSelectMode ? "Cancel Selection" : "Select Multiple Days"}
          >
            <CheckSquare className="w-5 h-5 md:hidden" />
            <span className="hidden md:inline">
              {isMultiSelectMode ? "Cancel Selection" : "Select Multiple Days"}
            </span>
          </button>
        )}
      </div>

      {/* Right: Actions & Profile */}
      <div className="hidden md:flex items-center gap-6 w-12 h-12">
        {/* Placeholder to keep center layout intact */}
      </div>
    </header>
  );
}
