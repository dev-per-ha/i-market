import React, { useState } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  User,
  FileText,
  Search,
  Send,
  Bell,
  Settings,
  LogOut,
  Menu,
  X,
  Sparkles,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const StudentLayout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    {
      name: "Dashboard",
      icon: <LayoutDashboard size={20} />,
      path: "/student/dashboard",
    },
    { name: "My Profile", icon: <User size={20} />, path: "/student/profile" },
    {
      name: "Create CV",
      icon: <FileText size={20} />,
      path: "/student/create-cv",
    },
    {
      name: "Suggested",
      icon: <Search size={20} />,
      path: "/student/suggested",
    },
    {
      name: "My Requests",
      icon: <Send size={20} />,
      path: "/student/requests",
    },
    {
      name: "Settings",
      icon: <Settings size={20} />,
      path: "/student/settings",
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token"); // Or your auth logic
    navigate("/login");
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-[#1c1f4c] dark:to-[#1c1f4c]/95 font-sans overflow-hidden">
      {/* PREMIUM SIDEBAR - Fixed, non-scrollable */}
      <aside
        className={`${isSidebarOpen ? "w-72" : "w-20"} bg-gradient-to-b from-[#1c1f4c] to-[#1c1f4c]/95 backdrop-blur-sm text-white transition-all duration-500 ease-out flex flex-col shadow-2xl shadow-black/30 relative z-40`}
      >
        {/* Premium Logo Section */}
        <div className="relative group border-b border-white/10">
          <div className="absolute inset-0 bg-gradient-to-r from-[#00848c]/20 to-[#fec20f]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div
            className={`p-6 flex items-center ${isSidebarOpen ? "justify-between" : "justify-center"} relative z-10`}
          >
            {isSidebarOpen ? (
              <>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#00848c] to-[#fec20f] rounded-xl blur-lg opacity-50"></div>
                    <div className="relative w-10 h-10 bg-gradient-to-br from-[#00848c] to-[#00848c]/80 rounded-xl flex items-center justify-center shadow-lg">
                      <Sparkles
                        className="w-5 h-5 text-white"
                        strokeWidth={1.5}
                      />
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <h1 className="text-xl font-serif font-bold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent tracking-tight">
                      SkillMatch
                    </h1>
                    <span className="text-[9px] text-white/40 font-mono tracking-wider uppercase">
                      Student Portal
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setSidebarOpen(!isSidebarOpen)}
                  className="p-2 rounded-xl hover:bg-white/10 transition-all duration-300 hover:scale-105"
                >
                  <ChevronLeft
                    size={18}
                    className="text-white/60 hover:text-[#fec20f] transition-colors"
                  />
                </button>
              </>
            ) : (
              <button
                onClick={() => setSidebarOpen(!isSidebarOpen)}
                className="p-2 rounded-xl hover:bg-white/10 transition-all duration-300 hover:scale-105"
              >
                <ChevronRight
                  size={18}
                  className="text-white/60 hover:text-[#fec20f] transition-colors"
                />
              </button>
            )}
          </div>
        </div>

        {/* Navigation Menu - Scrollable if needed */}
        <nav className="flex-1 mt-6 px-3 overflow-y-auto custom-scrollbar">
          <div className="space-y-1.5">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`group relative flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-300 overflow-hidden ${
                  location.pathname === item.path
                    ? "bg-gradient-to-r from-[#00848c]/20 to-[#00848c]/5 text-white shadow-lg shadow-[#00848c]/10"
                    : "text-white/70 hover:text-white hover:bg-white/5"
                }`}
              >
                {/* Hover/Active Glow Effect */}
                <div
                  className={`absolute inset-0 bg-gradient-to-r from-[#00848c]/0 via-[#fec20f]/0 to-transparent transition-all duration-500 ${
                    location.pathname === item.path
                      ? "opacity-100"
                      : "group-hover:opacity-100 opacity-0"
                  }`}
                ></div>

                {/* Left accent bar for active item */}
                {location.pathname === item.path && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-gradient-to-b from-[#00848c] to-[#fec20f] rounded-r-full shadow-lg shadow-[#00848c]/50"></div>
                )}

                {/* Icon with animation */}
                <div
                  className={`relative z-10 transition-all duration-300 ${
                    location.pathname === item.path
                      ? "scale-110"
                      : "group-hover:scale-110"
                  }`}
                >
                  {React.cloneElement(item.icon, {
                    className: `transition-colors ${
                      location.pathname === item.path
                        ? "text-[#fec20f]"
                        : "group-hover:text-[#fec20f]"
                    }`,
                    size: 20,
                  })}
                </div>

                {/* Menu text */}
                {isSidebarOpen && (
                  <span className="relative z-10 font-medium tracking-wide">
                    {item.name}
                  </span>
                )}

                {/* Active indicator dot */}
                {location.pathname === item.path && isSidebarOpen && (
                  <div className="absolute right-3 z-10 w-1.5 h-1.5 rounded-full bg-[#fec20f] shadow-glow animate-pulse"></div>
                )}
              </Link>
            ))}
          </div>
        </nav>

        {/* Premium Logout Button */}
        <div className="p-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="group relative w-full flex items-center gap-3 bg-gradient-to-r from-red-500/20 to-red-600/20 hover:from-red-500 hover:to-red-600 py-2.5 px-4 rounded-xl transition-all duration-300 overflow-hidden border border-red-500/30 hover:border-red-500/60"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-red-500/0 via-red-500/0 to-red-500/0 group-hover:from-red-500/20 group-hover:via-red-500/10 transition-all duration-500"></div>
            <LogOut
              size={18}
              className="relative z-10 text-red-400 group-hover:text-white transition-colors"
            />
            {isSidebarOpen && (
              <span className="relative z-10 text-red-400 group-hover:text-white transition-colors font-medium tracking-wide">
                Logout
              </span>
            )}
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* PREMIUM TOP NAVBAR */}
        <header className="h-16 bg-white/80 dark:bg-[#1c1f4c]/80 backdrop-blur-xl shadow-xl shadow-black/5 border-b border-gray-200/50 dark:border-white/10 flex items-center justify-between px-6 lg:px-8">
          <div className="flex items-center gap-3">
            {/* Mobile menu button (optional - for responsive) */}
            <button
              onClick={() => setSidebarOpen(!isSidebarOpen)}
              className="lg:hidden p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-white/10 transition-all duration-300"
            >
              <Menu size={20} className="text-gray-700 dark:text-white/80" />
            </button>

            <h2 className="text-lg font-serif font-semibold bg-gradient-to-r from-[#1c1f4c] to-[#00848c] dark:from-white dark:to-white/80 bg-clip-text text-transparent">
              {menuItems.find((m) => m.path === location.pathname)?.name ||
                "Welcome"}
              <span className="text-sm font-sans font-normal text-gray-400 dark:text-white/40 ml-2">
                / Student
              </span>
            </h2>
          </div>

          <div className="flex items-center gap-4">
            {/* Premium Notification Bell */}
            <button className="group relative p-2 rounded-xl bg-gray-50 dark:bg-white/5 hover:bg-[#00848c]/10 transition-all duration-300">
              <Bell
                size={20}
                className="text-gray-500 dark:text-white/60 group-hover:text-[#00848c] transition-colors"
                strokeWidth={1.5}
              />
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-gradient-to-r from-[#fec20f] to-[#fec20f]/80 rounded-full shadow-glow animate-pulse"></span>
            </button>

            {/* Premium User Profile */}
            <div className="flex items-center gap-3 border-l border-gray-200 dark:border-white/10 pl-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-gray-900 dark:text-white tracking-tight">
                  Abebe Kebede
                </p>
                <p className="text-xs text-[#00848c] dark:text-[#00848c] font-mono tracking-wide">
                  Student
                </p>
              </div>
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-[#00848c] to-[#fec20f] rounded-full blur-md opacity-0 group-hover:opacity-75 transition-opacity duration-500"></div>
                <img
                  src="https://ui-avatars.com/api/?name=Abebe+Kebede&background=00848c&color=fff&bold=true"
                  alt="Profile"
                  className="relative w-10 h-10 rounded-full border-2 border-[#00848c]/30 group-hover:border-[#fec20f]/50 transition-all duration-300"
                />
              </div>
            </div>
          </div>
        </header>

        {/* DYNAMIC PAGE CONTENT with premium styling */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8 custom-scrollbar">
          <div className="relative group">
            {/* Decorative glow behind content */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-[#00848c]/20 to-[#fec20f]/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>

            {/* Content Container */}
            <div className="relative bg-white/90 dark:bg-[#1c1f4c]/50 backdrop-blur-sm rounded-2xl shadow-2xl shadow-black/5 dark:shadow-black/20 border border-gray-200/50 dark:border-white/10 overflow-hidden">
              <div className="p-6 lg:p-8">
                <Outlet />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default StudentLayout;
