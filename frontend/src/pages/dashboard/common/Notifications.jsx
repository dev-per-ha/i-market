import { useEffect, useState } from "react";
import API from "../../../services/api";
import { Bell, CheckCircle, Circle, Clock, ChevronRight } from "lucide-react";

const Notifications = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [markingRead, setMarkingRead] = useState(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await API.get("/notifications");
        setData(res.data);
      } catch (err) {
        console.error("Failed to fetch notifications:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const markRead = async (id) => {
    setMarkingRead(id);
    try {
      await API.put(`/notifications/${id}/read`);
      // Update local state to reflect read status
      setData((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n)),
      );
    } catch (err) {
      console.error("Failed to mark as read:", err);
    } finally {
      setMarkingRead(null);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24)
      return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
    return date.toLocaleDateString();
  };

  const unreadCount = data.filter((n) => !n.isRead).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="relative">
          <div className="w-12 h-12 border-4 border-[#00848c]/20 border-t-[#00848c] rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-500 dark:text-white/40 text-sm">
            Loading notifications...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-[#1c1f4c] dark:to-[#1c1f4c]/95 p-6 lg:p-8">
      {/* Header with unread count */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-[#00848c] to-[#00848c]/80 shadow-lg shadow-[#00848c]/25">
            <Bell size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl lg:text-3xl font-serif font-bold bg-gradient-to-r from-[#1c1f4c] to-[#00848c] bg-clip-text text-transparent">
              Notifications
            </h1>
            {unreadCount > 0 && (
              <p className="text-sm text-gray-500 dark:text-white/40 mt-1">
                You have {unreadCount} unread notification
                {unreadCount !== 1 ? "s" : ""}
              </p>
            )}
          </div>
        </div>

        {unreadCount > 0 && (
          <div className="px-3 py-1.5 rounded-full bg-[#fec20f]/10 border border-[#fec20f]/20">
            <span className="text-xs font-semibold text-[#fec20f]">
              {unreadCount} unread
            </span>
          </div>
        )}
      </div>

      {/* Notifications List */}
      {data.length === 0 ? (
        <div className="relative">
          <div className="bg-white/90 dark:bg-[#1c1f4c]/50 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 dark:border-white/10 p-12 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="p-4 rounded-full bg-gray-100 dark:bg-white/5">
                <Bell
                  size={48}
                  className="text-gray-400 dark:text-white/20"
                  strokeWidth={1.5}
                />
              </div>
              <p className="text-gray-500 dark:text-white/40 font-medium">
                No notifications
              </p>
              <p className="text-sm text-gray-400 dark:text-white/20">
                When you receive notifications, they'll appear here
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative">
          <div className="bg-white/90 dark:bg-[#1c1f4c]/50 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 dark:border-white/10 overflow-hidden">
            <div className="divide-y divide-gray-100 dark:divide-white/5">
              {data.map((notification, index) => (
                <div
                  key={notification._id}
                  onClick={() =>
                    !notification.isRead && markRead(notification._id)
                  }
                  className={`
                    group relative flex items-start gap-4 p-5 cursor-pointer
                    transition-all duration-300 hover:bg-gray-50 dark:hover:bg-white/5
                    ${!notification.isRead ? "bg-[#00848c]/5 dark:bg-[#00848c]/10" : ""}
                  `}
                  style={{ animationDelay: `${index * 30}ms` }}
                >
                  {/* Status indicator */}
                  <div className="flex-shrink-0 mt-0.5">
                    {!notification.isRead ? (
                      <div className="relative">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#00848c] animate-pulse"></div>
                        <div className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-[#00848c] animate-ping opacity-75"></div>
                      </div>
                    ) : (
                      <CheckCircle
                        size={16}
                        className="text-gray-300 dark:text-white/20"
                      />
                    )}
                  </div>

                  {/* Notification content */}
                  <div className="flex-1 min-w-0">
                    <p
                      className={`
                      text-sm leading-relaxed
                      ${
                        !notification.isRead
                          ? "text-gray-900 dark:text-white font-medium"
                          : "text-gray-500 dark:text-white/60"
                      }
                    `}
                    >
                      {notification.message}
                    </p>

                    {/* Timestamp */}
                    <div className="flex items-center gap-1.5 mt-2">
                      <Clock
                        size={12}
                        className="text-gray-400 dark:text-white/30"
                      />
                      <span className="text-xs text-gray-400 dark:text-white/30">
                        {formatDate(notification.createdAt)}
                      </span>
                    </div>
                  </div>

                  {/* Arrow indicator */}
                  {!notification.isRead && (
                    <ChevronRight
                      size={16}
                      className="flex-shrink-0 text-gray-400 dark:text-white/30 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1"
                    />
                  )}

                  {/* Marking as read loading state */}
                  {markingRead === notification._id && (
                    <div className="absolute inset-0 bg-white/50 dark:bg-black/20 flex items-center justify-center rounded-2xl">
                      <div className="w-5 h-5 border-2 border-[#00848c]/20 border-t-[#00848c] rounded-full animate-spin"></div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notifications;
