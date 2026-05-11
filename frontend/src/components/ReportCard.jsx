import React from "react";
import { Share2, FileText, Calendar, Users } from "lucide-react";

const ReportCard = ({ report, showShareButton, onShare }) => {
  return (
    <div className="group relative bg-gradient-to-br from-white to-gray-50/50 dark:from-[#1c1f4c] dark:to-[#1c1f4c]/80 backdrop-blur-sm border border-gray-200/50 dark:border-white/10 rounded-2xl p-5 flex justify-between items-start transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-[#00848c]/10 dark:hover:shadow-[#00848c]/20 hover:border-[#00848c]/30">
      {/* Premium background glow effect on hover */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#00848c]/0 via-[#fec20f]/0 to-[#00848c]/0 group-hover:from-[#00848c]/5 group-hover:via-[#fec20f]/5 transition-all duration-500 pointer-events-none"></div>

      {/* Left accent bar for premium feel */}
      <div className="absolute left-0 top-4 bottom-4 w-1 bg-gradient-to-b from-[#00848c] to-[#fec20f] rounded-r-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

      {/* CONTENT SECTION */}
      <div className="flex-1 relative z-10">
        {/* Title with icon */}
        <div className="flex items-center gap-2 mb-2">
          <FileText
            className="w-4 h-4 text-[#00848c] dark:text-[#00848c]"
            strokeWidth={1.5}
          />
          <h3 className="font-serif font-semibold text-gray-900 dark:text-white text-lg tracking-tight">
            {report.title}
          </h3>
        </div>

        {/* Content - premium typography */}
        <p className="text-sm text-gray-600 dark:text-white/70 leading-relaxed mb-3 pl-6 border-l-2 border-gray-200 dark:border-white/10">
          {report.content}
        </p>

        {/* Metadata section with icons */}
        <div className="flex items-center gap-4 pl-6">
          <div className="flex items-center gap-1.5">
            <Calendar
              className="w-3.5 h-3.5 text-gray-400 dark:text-white/40"
              strokeWidth={1.5}
            />
            <span className="text-xs text-gray-500 dark:text-white/40 font-mono tracking-tight">
              Attendance: {report.attendance || "N/A"}
            </span>
          </div>

          {/* Optional: Add status indicator if shared */}
          {report.sharedWithAdvisor && (
            <div className="flex items-center gap-1.5">
              <Users
                className="w-3.5 h-3.5 text-[#00848c] dark:text-[#00848c]"
                strokeWidth={1.5}
              />
              <span className="text-xs text-[#00848c] dark:text-[#00848c] font-medium">
                Shared with Advisor
              </span>
            </div>
          )}
        </div>
      </div>

      {/* BUTTON SECTION - Premium styling */}
      {showShareButton && !report.sharedWithAdvisor && (
        <button
          onClick={() => onShare(report._id)}
          className="group/btn relative ml-4 bg-gradient-to-r from-[#00848c] to-[#00848c]/80 hover:from-[#fec20f] hover:to-[#fec20f]/90 text-white px-4 py-2 rounded-xl shadow-md shadow-[#00848c]/25 hover:shadow-lg hover:shadow-[#fec20f]/30 transition-all duration-300 flex items-center gap-2 overflow-hidden"
        >
          {/* Button shine effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700"></div>

          {/* Icon with animation */}
          <Share2
            className="w-4 h-4 relative z-10 transition-transform duration-300 group-hover/btn:rotate-12"
            strokeWidth={1.5}
          />

          {/* Text */}
          <span className="relative z-10 text-sm font-medium tracking-wide">
            Share with Advisor
          </span>
        </button>
      )}

      {/* Decorative element: subtle corner accent */}
      <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-gradient-to-br from-[#00848c]/10 to-transparent pointer-events-none"></div>
    </div>
  );
};

export default ReportCard;
