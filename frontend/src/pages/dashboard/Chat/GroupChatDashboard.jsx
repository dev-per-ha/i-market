import React, { useEffect, useState } from "react";
import API from "../../../services/api";
import { useSocket } from "../../../context/SocketContext";
import { useNavigate } from "react-router-dom";
import {
  FaCircle,
  FaComments,
  FaUser,
  FaUsers,
  FaImage,
  FaPaperclip,
  FaChevronRight,
  FaClock,
} from "react-icons/fa";
import { HiOutlineChatAlt2 } from "react-icons/hi";

const GroupChatDashboard = () => {
  const { socket, user, onlineUsers = [] } = useSocket();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const backendURL = "http://localhost:5000";

  const fetchRooms = async () => {
    try {
      const res = await API.get("/chat");
      setRooms(res.data);
    } catch (err) {
      console.error("Failed to fetch rooms:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!socket || !user) return;

    fetchRooms();

    socket.on("newChatRoom", (room) => {
      setRooms((prev) => [room, ...prev]);
    });

    socket.on("newMessage", (msg) => {
      setRooms((prev) =>
        prev.map((room) =>
          room._id === msg.room ? { ...room, lastMessage: msg } : room,
        ),
      );
    });

    return () => {
      socket.off("newChatRoom");
      socket.off("newMessage");
    };
  }, [socket, user]);

  const formatTime = (date) => {
    if (!date) return "";
    const msgDate = new Date(date);
    const now = new Date();
    const diffHours = (now - msgDate) / (1000 * 60 * 60);

    if (diffHours < 24) {
      return msgDate.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (diffHours < 48) {
      return "Yesterday";
    } else {
      return msgDate.toLocaleDateString([], { month: "short", day: "numeric" });
    }
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-[#00848c]/20 border-t-[#00848c] rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-500 dark:text-white/40 font-mono text-sm">
            Loading chats...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[85vh] max-w-7xl mx-auto p-4">
      <div className="flex h-[82vh] bg-white/90 dark:bg-[#1c1f4c]/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-200/50 dark:border-white/10 overflow-hidden">
        {/* ==================== PREMIUM SIDEBAR ==================== */}
        <div className="w-full md:w-96 lg:w-96 bg-gradient-to-b from-gray-50/50 to-white/50 dark:from-[#1c1f4c]/50 dark:to-[#1c1f4c]/30 border-r border-gray-200 dark:border-white/10 flex flex-col">
          {/* Sidebar Header */}
          <div className="p-5 border-b border-gray-200 dark:border-white/10 bg-gradient-to-r from-[#00848c]/5 to-transparent">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-[#00848c] to-[#00848c]/80 shadow-lg shadow-[#00848c]/25">
                <FaComments size={18} className="text-white" />
              </div>
              <div>
                <h2 className="font-serif font-bold text-xl text-gray-900 dark:text-white">
                  My Chats
                </h2>
                <p className="text-xs text-gray-500 dark:text-white/40 font-mono">
                  {rooms.length} active conversations
                </p>
              </div>
            </div>
          </div>

          {/* Chat List */}
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {rooms.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center mb-4">
                  <HiOutlineChatAlt2
                    size={32}
                    className="text-gray-400 dark:text-white/20"
                  />
                </div>
                <p className="text-gray-500 dark:text-white/40 font-medium">
                  No chats yet
                </p>
                <p className="text-sm text-gray-400 dark:text-white/20 mt-1">
                  Start a conversation!
                </p>
              </div>
            ) : (
              rooms.map((room, index) => {
                const isOnline = room.members.some(
                  (m) => m._id !== user._id && onlineUsers.includes(m._id),
                );
                const last = room.lastMessage;
                const otherMember = room.members.find(
                  (m) => m._id !== user._id,
                );
                const chatName = room.isGroup
                  ? room.groupName || "Group Chat"
                  : otherMember?.name || "Unknown User";
                const chatAvatar = room.isGroup ? (
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#00848c]/10 to-[#fec20f]/10 flex items-center justify-center">
                    <FaUsers size={20} className="text-[#00848c]" />
                  </div>
                ) : (
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#00848c] to-[#fec20f] rounded-xl blur-md opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
                    <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-[#00848c] to-[#00848c]/80 flex items-center justify-center shadow-lg">
                      <span className="text-white font-bold text-lg">
                        {chatName[0]?.toUpperCase() || "U"}
                      </span>
                    </div>
                    {isOnline && (
                      <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white dark:border-[#1c1f4c]"></div>
                    )}
                  </div>
                );

                return (
                  <div
                    key={room._id}
                    onClick={() => navigate(`/student/chat/${room._id}`)}
                    className="group relative flex items-center gap-3 p-4 hover:bg-gradient-to-r hover:from-[#00848c]/5 hover:to-transparent cursor-pointer transition-all duration-300 border-b border-gray-100 dark:border-white/5"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    {/* Hover effect overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-[#00848c]/0 to-[#fec20f]/0 group-hover:from-[#00848c]/5 group-hover:to-[#fec20f]/5 transition-all duration-500"></div>

                    {/* Avatar */}
                    {chatAvatar}

                    {/* Chat Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-semibold text-gray-900 dark:text-white truncate group-hover:text-[#00848c] transition-colors duration-300">
                          {chatName}
                        </p>
                        {last && (
                          <span className="text-[10px] font-mono text-gray-400 dark:text-white/30 flex-shrink-0">
                            {formatTime(last.createdAt)}
                          </span>
                        )}
                      </div>

                      {/* Last Message Preview */}
                      {last && (
                        <div className="text-xs text-gray-500 dark:text-white/40 mt-1 flex items-center gap-1.5">
                          <span className="truncate">
                            {last.sender?._id === user._id ? (
                              <span className="font-medium text-[#00848c]">
                                You:{" "}
                              </span>
                            ) : (
                              <span className="font-medium">
                                {last.sender?.name?.split(" ")[0] || "Unknown"}:
                              </span>
                            )}
                            {last.fileUrl ? (
                              last.fileType?.startsWith("image") ? (
                                <span className="flex items-center gap-1">
                                  <FaImage size={10} />
                                  Image
                                </span>
                              ) : (
                                <span className="flex items-center gap-1">
                                  <FaPaperclip size={10} />
                                  File
                                </span>
                              )
                            ) : (
                              <span className="truncate">{last.message}</span>
                            )}
                          </span>
                        </div>
                      )}

                      {/* Unread indicator placeholder (can be enhanced) */}
                      {!last && (
                        <div className="text-xs text-gray-400 dark:text-white/30 mt-1 flex items-center gap-1">
                          <FaClock size={10} />
                          <span>No messages yet</span>
                        </div>
                      )}
                    </div>

                    {/* Online Status Indicator for DM */}
                    {!room.isGroup && isOnline && (
                      <div className="flex-shrink-0">
                        <div className="relative">
                          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
                          <div className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping opacity-75"></div>
                        </div>
                      </div>
                    )}

                    {/* Arrow indicator on hover */}
                    <FaChevronRight
                      size={12}
                      className="text-gray-300 dark:text-white/20 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1 flex-shrink-0"
                    />
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* ==================== EMPTY STATE / WELCOME ==================== */}
        <div className="hidden md:flex flex-1 flex-col items-center justify-center bg-gradient-to-br from-gray-50/30 to-transparent dark:from-white/5">
          <div className="text-center max-w-sm px-8">
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-gradient-to-r from-[#00848c] to-[#fec20f] rounded-full blur-2xl opacity-20 animate-pulse"></div>
              <div className="relative w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-[#00848c]/10 to-[#fec20f]/10 flex items-center justify-center">
                <FaComments size={40} className="text-[#00848c]/60" />
              </div>
            </div>
            <h3 className="font-serif text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Welcome to Chat
            </h3>
            <p className="text-gray-500 dark:text-white/40 leading-relaxed">
              Select a conversation from the sidebar to start messaging
            </p>
            <div className="mt-6 flex justify-center gap-2">
              <div
                className="w-1.5 h-1.5 rounded-full bg-[#00848c] animate-bounce"
                style={{ animationDelay: "0ms" }}
              ></div>
              <div
                className="w-1.5 h-1.5 rounded-full bg-[#00848c] animate-bounce"
                style={{ animationDelay: "150ms" }}
              ></div>
              <div
                className="w-1.5 h-1.5 rounded-full bg-[#00848c] animate-bounce"
                style={{ animationDelay: "300ms" }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupChatDashboard;
