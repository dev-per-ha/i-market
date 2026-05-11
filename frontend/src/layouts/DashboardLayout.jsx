import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { Menu, X, ChevronLeft, ChevronRight, Bell } from "lucide-react";

// SOCKET + TOAST
import { useSocket } from "../context/SocketContext";
import { toast } from "react-toastify";

// NOTIFICATIONS
import NotificationButton from "../components/notifications/NotificationBell";
import NotificationPanel from "../components/notifications/NotificationPanel";
import API from "../services/api";

import { useNavigate } from "react-router-dom";

const DashboardLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // NOTIFICATION STATE
  const [openNotif, setOpenNotif] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const { socket } = useSocket();
  const navigate = useNavigate();

  // =========================
  // FETCH NOTIFICATIONS
  // =========================
  const fetchNotifications = async () => {
    try {
      const res = await API.get("/notifications");

      const data = Array.isArray(res.data?.notifications)
        ? res.data.notifications
        : [];

      setNotifications(data);
      setUnreadCount(res.data?.unreadCount || 0);
    } catch (err) {
      console.log("Notification fetch error:", err);
      setNotifications([]);
      setUnreadCount(0);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  // =========================
  // JOIN NOTIFICATION ROOM
  // =========================
  useEffect(() => {
    if (!socket) return;

    const user = JSON.parse(localStorage.getItem("user"));
    if (!user?._id) return;

    const joinNotificationRoom = () => {
      socket.emit("joinNotification", user._id);
    };

    if (socket.connected) {
      joinNotificationRoom();
    } else {
      socket.on("connect", joinNotificationRoom);
    }

    socket.on("reconnect", joinNotificationRoom);

    return () => {
      socket.off("connect", joinNotificationRoom);
      socket.off("reconnect", joinNotificationRoom);
    };
  }, [socket]);

  // =========================
  // REAL TIME NOTIFICATIONS
  // =========================
  useEffect(() => {
    if (!socket) return;

    const user = JSON.parse(localStorage.getItem("user"));

    if (!user?._id) return;

    const handleNotification = (data) => {
      // FORCE STRING COMPARISON
      const targetUser = String(data.user || "");
      const currentUser = String(user._id);

      // BLOCK OTHER USERS NOTIFICATIONS
      if (targetUser !== currentUser) {
        return;
      }

      setNotifications((prev) => {
        const exists = prev.some((n) => String(n._id) === String(data._id));

        if (exists) return prev;

        return [data, ...prev];
      });

      setUnreadCount((prev) => prev + 1);

      toast.info(data.message);
    };

    socket.on("new_notification", handleNotification);

    return () => {
      socket.off("new_notification", handleNotification);
    };
  }, [socket]);

  // =========================
  // CLICK NOTIFICATION (FIXED)
  // =========================
  const handleNotificationClick = async (notif) => {
    try {
      await API.put(`/notifications/${notif._id}/read`);

      setNotifications((prev) =>
        prev.map((n) => (n._id === notif._id ? { ...n, isRead: true } : n)),
      );

      setUnreadCount((prev) => Math.max(prev - 1, 0));
      setOpenNotif(false);

      // FIXED ROUTING (NO window.location)
      const targetRoute =
        notif.link && notif.link !== "undefined" && notif.link !== null
          ? notif.link
          : "/student/applications";

      navigate(targetRoute);
    } catch (err) {
      console.log(err);
    }
  };

  // =========================
  // MARK ALL READ
  // =========================
  const handleMarkAll = async () => {
    try {
      await API.put("/notifications/read-all");

      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));

      setUnreadCount(0);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-[#1c1f4c] dark:to-[#1c1f4c]/95 min-h-screen text-gray-900 dark:text-white">
      <Navbar />

      <div className="flex pt-20">
        {/* DESKTOP SIDEBAR - Premium styling */}
        <div
          className={`hidden md:block transition-all duration-500 ease-out ${
            collapsed ? "w-20" : "w-72"
          }`}
        >
          <Sidebar collapsed={collapsed} />
        </div>

        {/* PREMIUM MOBILE SIDEBAR OVERLAY */}
        {mobileOpen && (
          <div className="fixed inset-0 z-50 flex animate-fadeIn">
            <div
              className="fixed inset-0 bg-[#1c1f4c]/80 backdrop-blur-md"
              onClick={() => setMobileOpen(false)}
            />
            <div className="relative w-80 bg-gradient-to-b from-[#1c1f4c] to-[#1c1f4c]/95 shadow-2xl shadow-black/50 z-50 animate-slideInRight">
              <div className="absolute top-4 right-4">
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-all duration-200"
                >
                  <X size={20} className="text-white" />
                </button>
              </div>
              <Sidebar collapsed={false} />
            </div>
          </div>
        )}

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {/* PREMIUM TOOLBAR */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex gap-3">
              {/* Mobile menu button */}
              <button
                onClick={() => setMobileOpen(true)}
                className="md:hidden group relative bg-white/80 dark:bg-white/5 backdrop-blur-sm border border-gray-200 dark:border-white/10 px-3.5 py-2.5 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
              >
                <Menu
                  size={18}
                  className="text-gray-700 dark:text-white/80 group-hover:text-[#00848c] transition-colors"
                />
              </button>

              {/* Desktop collapse button */}
              <button
                onClick={() => setCollapsed(!collapsed)}
                className="hidden md:flex group relative bg-white/80 dark:bg-white/5 backdrop-blur-sm border border-gray-200 dark:border-white/10 px-3.5 py-2.5 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 items-center gap-2"
              >
                {collapsed ? (
                  <ChevronRight
                    size={18}
                    className="text-gray-700 dark:text-white/80 group-hover:text-[#00848c] transition-colors"
                  />
                ) : (
                  <ChevronLeft
                    size={18}
                    className="text-gray-700 dark:text-white/80 group-hover:text-[#00848c] transition-colors"
                  />
                )}
                <span
                  className={`text-sm font-medium text-gray-700 dark:text-white/80 group-hover:text-[#00848c] transition-colors ${collapsed ? "hidden" : "inline"}`}
                >
                  {collapsed ? "Expand" : "Collapse"}
                </span>
              </button>
            </div>

            {/* Decorative element - current time/date (frontend only) */}
            <div className="hidden lg:flex items-center gap-2 px-3 py-2 bg-white/50 dark:bg-white/5 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-white/10">
              <div className="w-2 h-2 rounded-full bg-[#00848c] animate-pulse"></div>
              <span className="text-xs font-mono text-gray-500 dark:text-white/40 tracking-wide">
                {new Date().toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>

          {/* PREMIUM CONTENT CARD */}
          <div className="relative group">
            {/* Decorative glow behind card */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-[#00848c]/20 to-[#fec20f]/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

            {/* Main content card */}
            <div className="relative bg-white/90 dark:bg-[#1c1f4c]/50 backdrop-blur-sm rounded-3xl shadow-2xl shadow-black/5 dark:shadow-black/20 border border-gray-200/50 dark:border-white/10 overflow-hidden">
              <div className="p-6 lg:p-8 min-h-[calc(100vh-180px)]">
                {children}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* PREMIUM NOTIFICATION COMPONENTS */}
      <NotificationButton
        count={unreadCount}
        onClick={() => setOpenNotif(true)}
      />

      <NotificationPanel
        open={openNotif}
        onClose={() => setOpenNotif(false)}
        notifications={notifications}
        onClickItem={handleNotificationClick}
        onMarkAll={handleMarkAll}
      />
    </div>
  );
};

export default DashboardLayout;
