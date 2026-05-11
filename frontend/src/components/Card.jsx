import {
  User,
  FileText,
  Lightbulb,
  Search,
  ClipboardList,
  Bell,
  Settings,
  LogOut,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

const mainItems = [
  { title: "My Profile", url: "/dashboard-student/profile", icon: User },
  { title: "Create CV", url: "/dashboard-student/cv", icon: FileText },
  {
    title: "Suggested Internships",
    url: "/dashboard-student/suggested",
    icon: Lightbulb,
  },
  {
    title: "Search Internship",
    url: "/dashboard-student/search",
    icon: Search,
  },
  {
    title: "My Requests",
    url: "/dashboard-student/requests",
    icon: ClipboardList,
  },
  {
    title: "Notifications",
    url: "/dashboard-student/notifications",
    icon: Bell,
  },
  { title: "Settings", url: "/dashboard-student/settings", icon: Settings },
];

export default function StudentSidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="h-screen w-72 bg-gradient-to-b from-[#1c1f4c] to-[#1c1f4c]/95 backdrop-blur-sm border-r border-white/10 flex flex-col shadow-2xl shadow-black/20">
      {/* PREMIUM LOGO SECTION with glassmorphism */}
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-[#00848c]/20 to-[#fec20f]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div className="flex items-center gap-3 px-6 py-6 border-b border-white/10 relative z-10">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-[#00848c] to-[#fec20f] rounded-xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
            <div className="relative w-10 h-10 bg-gradient-to-br from-[#00848c] to-[#00848c]/80 text-white flex items-center justify-center rounded-xl font-bold text-lg shadow-lg">
              S
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-serif font-bold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent tracking-tight">
              SkillMatch
            </span>
            <span className="text-[10px] text-white/40 font-mono tracking-wider uppercase">
              Student Portal
            </span>
          </div>
        </div>
      </div>

      {/* ELEGANT MENU with premium animations */}
      <div className="flex-1 p-5 overflow-y-auto custom-scrollbar">
        <div className="mb-6 px-3">
          <p className="text-[10px] font-mono tracking-wider text-white/30 uppercase">
            Main Navigation
          </p>
        </div>
        <ul className="space-y-2">
          {mainItems.map((item, index) => {
            const Icon = item.icon;
            const active = location.pathname === item.url;

            return (
              <li
                key={item.title}
                onClick={() => navigate(item.url)}
                className={`group relative flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm cursor-pointer transition-all duration-300 overflow-hidden ${
                  active
                    ? "bg-gradient-to-r from-[#00848c]/20 to-[#00848c]/5 text-white font-semibold shadow-lg shadow-[#00848c]/10"
                    : "text-white/60 hover:text-white hover:bg-white/5"
                }`}
                style={{
                  animationDelay: `${index * 50}ms`,
                }}
              >
                {/* Hover/Active Glow Effect */}
                <div
                  className={`absolute inset-0 bg-gradient-to-r from-[#00848c]/0 via-[#fec20f]/0 to-transparent transition-all duration-500 ${
                    active ? "opacity-100" : "group-hover:opacity-100 opacity-0"
                  }`}
                ></div>

                {/* Left accent bar for active item */}
                {active && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-gradient-to-b from-[#00848c] to-[#fec20f] rounded-r-full shadow-lg shadow-[#00848c]/50"></div>
                )}

                {/* Icon with hover effect */}
                <div
                  className={`relative z-10 transition-all duration-300 ${
                    active ? "scale-110" : "group-hover:scale-110"
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      active ? "text-[#fec20f]" : "group-hover:text-[#fec20f]"
                    }`}
                  />
                </div>

                {/* Menu text */}
                <span className="relative z-10 tracking-wide">
                  {item.title}
                </span>

                {/* Active indicator dot */}
                {active && (
                  <div className="absolute right-3 z-10 w-1.5 h-1.5 rounded-full bg-[#fec20f] shadow-glow animate-pulse"></div>
                )}
              </li>
            );
          })}
        </ul>
      </div>

      {/* PREMIUM LOGOUT SECTION */}
      <div className="p-5 border-t border-white/10 relative">
        {/* Decorative gradient line */}
        <div className="absolute top-0 left-5 right-5 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

        <button
          onClick={() => navigate("/")}
          className="group relative flex items-center gap-3 px-4 py-2.5 text-sm rounded-xl w-full text-left transition-all duration-300 overflow-hidden bg-white/5 hover:bg-red-500/10 border border-white/5 hover:border-red-500/30"
        >
          {/* Hover background effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-red-500/0 via-red-500/0 to-red-500/0 group-hover:from-red-500/5 group-hover:via-red-500/5 transition-all duration-500"></div>

          {/* Icon with hover animation */}
          <div className="relative z-10 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12">
            <LogOut className="w-4 h-4 text-white/60 group-hover:text-red-400 transition-colors" />
          </div>

          {/* Text */}
          <span className="relative z-10 text-white/60 group-hover:text-red-400 transition-colors font-medium tracking-wide">
            Logout
          </span>

          {/* Decorative arrow on hover */}
          <span className="relative z-10 ml-auto opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-1">
            →
          </span>
        </button>

        {/* Version info (decorative) */}
        <div className="mt-4 text-center">
          <p className="text-[9px] font-mono text-white/20 tracking-wider">
            v2.0.0 • Enterprise
          </p>
        </div>
      </div>
    </div>
  );
}
