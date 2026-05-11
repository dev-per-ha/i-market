import React from "react";
import { Bell } from "lucide-react";

const NotificationButton = ({ count = 0, onClick }) => {
  return (
    <div className="fixed bottom-8 right-8 z-50">
      <button
        onClick={onClick}
        className="relative group bg-gradient-to-br from-white/90 to-white/70 dark:from-[#1c1f4c]/90 dark:to-[#1c1f4c]/70 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-2xl shadow-black/10 dark:shadow-black/30 p-4 rounded-2xl hover:scale-105 active:scale-95 transition-all duration-300 ease-out hover:shadow-2xl hover:shadow-[#00848c]/20 dark:hover:shadow-[#00848c]/30 hover:border-[#00848c]/30"
      >
        {/* Glassmorphism inner glow */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        <Bell
          size={24}
          className="text-gray-700 dark:text-white/80 group-hover:text-[#00848c] transition-colors duration-300"
          strokeWidth={1.5}
        />

        {/* Premium Notification Badge */}
        {count > 0 && (
          <>
            {/* Elegant pulse ring */}
            <span className="absolute -top-1.5 -right-1.5 w-6 h-6 bg-gradient-to-br from-[#fec20f] to-[#fec20f]/70 rounded-full animate-ping opacity-60"></span>

            {/* Gold-accented badge */}
            <span className="absolute -top-1.5 -right-1.5 bg-gradient-to-br from-[#fec20f] to-[#fec20f]/80 text-[#1c1f4c] font-bold text-xs w-6 h-6 flex items-center justify-center rounded-full shadow-lg shadow-[#fec20f]/30 ring-2 ring-white dark:ring-[#1c1f4c]">
              {count > 99 ? "99+" : count}
            </span>
          </>
        )}
      </button>
    </div>
  );
};

export default NotificationButton;
