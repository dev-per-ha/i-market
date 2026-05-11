import React from "react";
import { X, Bell } from "lucide-react";

const NotificationPanel = ({
  open,
  onClose,
  notifications = [],
  onClickItem,
}) => {
  return (
    <>
      {/* PREMIUM BACKDROP */}
      {open && (
        <div
          className="fixed inset-0 bg-[#0f172a]/60 backdrop-blur-md z-40 transition-all duration-500"
          onClick={onClose}
        />
      )}

      {/* PANEL */}
      <div
        className={`fixed top-0 right-0 h-full w-[390px] bg-gradient-to-b from-[#111827] via-[#172033] to-[#0f172a] border-l border-white/10 shadow-[0_0_60px_rgba(0,0,0,0.45)] z-50 transform transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] flex flex-col overflow-hidden ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Decorative Glow */}
        <div className="absolute top-0 right-0 w-60 h-60 bg-[#fec20f]/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-[#00848c]/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* HEADER */}
        <div className="relative flex items-center justify-between px-6 py-5 border-b border-white/10 backdrop-blur-xl bg-white/[0.02]">
          <div>
            <h2 className="text-xl font-semibold text-white tracking-wide">
              Notifications
            </h2>

            <p className="text-xs text-white/40 mt-1 tracking-wider">
              Stay updated in real time
            </p>
          </div>

          <button
            onClick={onClose}
            className="group relative p-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 transition-all duration-300"
          >
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#00848c]/0 to-[#fec20f]/0 group-hover:from-[#00848c]/10 group-hover:to-[#fec20f]/10 transition-all duration-300"></div>

            <X
              size={18}
              className="relative z-10 text-white/60 group-hover:text-white transition-colors duration-300"
            />
          </button>
        </div>

        {/* LIST */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 custom-scrollbar">
          {/* EMPTY STATE */}
          {notifications.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="relative">
                <div className="absolute inset-0 bg-[#fec20f]/10 blur-2xl rounded-full"></div>

                <div className="relative w-20 h-20 rounded-full bg-white/[0.04] border border-white/10 flex items-center justify-center backdrop-blur-xl">
                  <Bell className="w-9 h-9 text-white/40" strokeWidth={1.5} />
                </div>
              </div>

              <h3 className="mt-6 text-white/70 font-medium text-sm tracking-wide">
                No Notifications
              </h3>

              <p className="text-white/30 text-xs mt-2 max-w-[220px] leading-relaxed">
                New alerts, updates, and important activities will appear here.
              </p>
            </div>
          )}

          {/* NOTIFICATIONS */}
          {notifications.map((n, index) => (
            <div
              key={n._id}
              onClick={() => onClickItem(n)}
              className={`group relative overflow-hidden rounded-2xl p-4 cursor-pointer transition-all duration-300 hover:scale-[1.015] ${
                !n.isRead
                  ? "bg-gradient-to-br from-[#00848c]/15 via-[#037272]/10 to-transparent border border-[#00848c]/20 shadow-lg shadow-[#00848c]/5"
                  : "bg-white/[0.03] border border-white/5 hover:bg-white/[0.05]"
              }`}
              style={{
                animationDelay: `${index * 70}ms`,
              }}
            >
              {/* Hover Glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#00848c]/0 via-[#fec20f]/0 to-[#00848c]/0 group-hover:from-[#00848c]/5 group-hover:via-[#fec20f]/5 group-hover:to-[#00848c]/5 transition-all duration-500"></div>

              {/* Top Accent */}
              {!n.isRead && (
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-[#00848c] via-[#fec20f] to-[#037272]"></div>
              )}

              <div className="relative z-10">
                {/* MESSAGE */}
                <div className="flex items-start justify-between gap-3">
                  <p
                    className={`text-sm leading-relaxed ${
                      !n.isRead ? "text-white font-medium" : "text-white/65"
                    }`}
                  >
                    {n.message}
                  </p>

                  {!n.isRead && (
                    <div className="relative mt-1">
                      <span className="absolute inline-flex h-2.5 w-2.5 rounded-full bg-[#fec20f] opacity-75 animate-ping"></span>

                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#fec20f]"></span>
                    </div>
                  )}
                </div>

                {/* TIME */}
                <div className="flex items-center gap-2 mt-3">
                  <div className="w-1 h-1 rounded-full bg-white/20"></div>

                  <span className="text-[11px] text-white/35 tracking-wide">
                    {n.createdAt
                      ? new Date(n.createdAt).toLocaleString()
                      : "Just now"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* FOOTER */}
        {notifications.length > 0 && (
          <div className="relative border-t border-white/10 px-6 py-4 bg-white/[0.02] backdrop-blur-xl">
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#fec20f]/30 to-transparent"></div>

            <p className="text-center text-xs text-white/35 tracking-[0.2em] uppercase">
              {notifications.filter((n) => !n.isRead).length} Unread
              Notifications
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default NotificationPanel;
