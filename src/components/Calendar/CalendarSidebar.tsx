import { Menu, Calendar as CalendarIcon, List, LogOut, X } from "lucide-react";
import { format } from "date-fns";
import { useAuth } from "../../context/AuthContext";

interface CalendarSidebarProps {
  currentDate: Date;
  activeTab: "calendar" | "exams";
  onTabChange: (tab: "calendar" | "exams") => void;
  isMobileMenuOpen?: boolean;
  setIsMobileMenuOpen?: (isOpen: boolean) => void;
}

export default function CalendarSidebar({ currentDate, activeTab, onTabChange, isMobileMenuOpen, setIsMobileMenuOpen }: CalendarSidebarProps) {
  const { signOut } = useAuth();
  const currentDay = format(currentDate, "dd");
  const currentMonthYear = format(currentDate, "MMMM yyyy");

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen?.(false)}
        />
      )}
      
      {/* Sidebar Content */}
      <aside className={`fixed md:relative top-0 left-0 h-[100dvh] md:h-auto flex w-[280px] md:w-[260px] flex-col p-6 bg-white z-50 transform transition-transform duration-300 ease-in-out ${
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      }`}>
        {/* Header / Menu Icon */}
        <div className="mb-8 flex items-center justify-between pl-2">
          <Menu className="h-7 w-7 text-gray-800 hidden md:block" />
          <div className="md:hidden font-black text-xl text-gray-800">Menu</div>
          <button 
            className="md:hidden p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-colors"
            onClick={() => setIsMobileMenuOpen?.(false)}
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Date Display */}
      <div className="mb-10 pl-2">
        <div className="text-[72px] leading-[0.8] font-black text-[#EF4444] tracking-tighter">
          {currentDay}
        </div>
        <div className="text-xl font-bold text-gray-800 mt-2">
          {currentMonthYear}
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex flex-col gap-2 flex-1">
        <button 
          onClick={() => onTabChange("calendar")}
          className={`flex items-center gap-3 px-5 py-3.5 rounded-[20px] font-medium transition-all ${
            activeTab === "calendar"
              ? "bg-[#EF4444] text-white shadow-[0_8px_16px_-6px_rgba(239,68,68,0.5)]"
              : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
          }`}
        >
          <CalendarIcon className="h-5 w-5" />
          Calendar
        </button>
        <button 
          onClick={() => onTabChange("exams")}
          className={`flex items-center gap-3 px-5 py-3.5 rounded-[20px] font-medium transition-all ${
            activeTab === "exams"
              ? "bg-[#EF4444] text-white shadow-[0_8px_16px_-6px_rgba(239,68,68,0.5)]"
              : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
          }`}
        >
          <List className="h-5 w-5" />
          Exams
        </button>
      </nav>

        {/* Logout at bottom */}
        <button 
          onClick={signOut}
          className="flex items-center gap-3 px-5 py-3.5 text-red-500 font-bold hover:bg-red-50 rounded-[20px] transition-all mt-auto"
        >
          <LogOut className="h-5 w-5" />
          Logout
        </button>
      </aside>
    </>
  );
}
