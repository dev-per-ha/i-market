import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import API from "../../../services/api";
import { io } from "socket.io-client";
import {
  FaPaperPlane,
  FaPaperclip,
  FaEdit,
  FaTrash,
  FaImage,
  FaFile,
  FaUser,
  FaUsers,
  FaCheck,
  FaCheckDouble,
} from "react-icons/fa";
import { IoMdClose } from "react-icons/io";

const ChatPage = () => {
  const { id } = useParams();

  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [user, setUser] = useState(null);
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  const [isGroup, setIsGroup] = useState(false);
  const [chatName, setChatName] = useState("");
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const scrollRef = useRef();
  const backendURL = "http://localhost:5000";

  // SOCKET
  useEffect(() => {
    const s = io(backendURL);
    setSocket(s);
    return () => s.disconnect();
  }, []);

  // USER
  useEffect(() => {
    const u = JSON.parse(localStorage.getItem("user"));
    setUser(u);

    if (u?._id && socket) {
      socket.emit("register", u._id);
    }
  }, [socket]);

  // LOAD CHAT
  useEffect(() => {
    if (!socket || !id) return;

    const load = async () => {
      const res = await API.get(`/chat/${id}`);
      setMessages(res.data.messages || []);
      setIsGroup(res.data.isGroup);
      setChatName(
        res.data.name || (res.data.isGroup ? "Group Chat" : "Direct Message"),
      );
    };

    load();
    socket.emit("joinRoom", id);

    socket.on("newMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    socket.on("messageUpdated", (updated) => {
      setMessages((prev) =>
        prev.map((m) => (m._id === updated._id ? updated : m)),
      );
    });

    socket.on("messageDeleted", (msgId) => {
      setMessages((prev) => prev.filter((m) => m._id !== msgId));
    });

    socket.on("userTyping", ({ userId, isTyping }) => {
      if (userId !== user?._id) {
        setIsTyping(isTyping);
      }
    });

    return () => {
      socket.off("newMessage");
      socket.off("messageUpdated");
      socket.off("messageDeleted");
      socket.off("userTyping");
    };
  }, [socket, id, user]);

  // SCROLL
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // TYPING INDICATOR
  useEffect(() => {
    if (!socket || !id) return;

    const timeout = setTimeout(() => {
      if (typing) {
        socket.emit("typing", { roomId: id, isTyping: false });
        setTyping(false);
      }
    }, 1000);

    return () => clearTimeout(timeout);
  }, [typing, socket, id]);

  const handleTyping = (e) => {
    setMessage(e.target.value);
    if (!typing) {
      setTyping(true);
      socket?.emit("typing", { roomId: id, isTyping: true });
    }
  };

  // SEND
  const sendMessage = async () => {
    if (!message.trim() && !file) return;

    const formData = new FormData();
    formData.append("roomId", id);
    formData.append("message", message);
    if (file) formData.append("file", file);

    const res = await API.post("/chat/message", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    socket.emit("sendMessage", {
      roomId: id,
      messageId: res.data._id,
    });

    setMessage("");
    setFile(null);
    setFileName("");
    setTyping(false);
    socket?.emit("typing", { roomId: id, isTyping: false });
  };

  // DELETE
  const deleteMsg = (msgId) => {
    setMessages((prev) => prev.filter((m) => m._id !== msgId));

    socket.emit("deleteMessage", {
      messageId: msgId,
      roomId: id,
    });
  };

  // EDIT
  const saveEdit = async () => {
    await API.put(`/chat/message/${editingId}`, {
      message: editText,
    });

    socket.emit("editMessage", {
      messageId: editingId,
      newText: editText,
      roomId: id,
    });

    setEditingId(null);
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-[#1c1f4c] dark:to-[#1c1f4c]/95 py-6 px-4">
      <div className="flex flex-col h-[85vh] max-w-5xl mx-auto bg-white/90 dark:bg-[#1c1f4c]/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-200/50 dark:border-white/10 overflow-hidden">
        {/* PREMIUM HEADER */}
        <div className="bg-gradient-to-r from-[#00848c] to-[#00848c]/90 dark:from-[#00848c] dark:to-[#006b72] text-white p-5 flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              {isGroup ? <FaUsers size={20} /> : <FaUser size={18} />}
            </div>
            <div>
              <h2 className="font-serif font-bold text-lg">{chatName}</h2>
              <p className="text-xs text-white/70 flex items-center gap-1">
                {isGroup ? (
                  <>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#fec20f]"></span>
                    Group Chat • {messages.length} messages
                  </>
                ) : (
                  <>
                    {isTyping ? (
                      <span className="italic">Typing...</span>
                    ) : (
                      <>
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                        Online
                      </>
                    )}
                  </>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* MESSAGES AREA */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#00848c]/10 to-[#fec20f]/10 flex items-center justify-center mb-4">
                <FaPaperPlane size={32} className="text-[#00848c]/40" />
              </div>
              <p className="text-gray-500 dark:text-white/40 font-medium">
                No messages yet
              </p>
              <p className="text-sm text-gray-400 dark:text-white/20 mt-1">
                Start the conversation!
              </p>
            </div>
          ) : (
            messages.map((msg, idx) => {
              const isMe = msg.sender?._id === user?._id;
              const showAvatar =
                !isMe &&
                (!messages[idx - 1] ||
                  messages[idx - 1]?.sender?._id !== msg.sender?._id);

              return (
                <div
                  key={msg._id}
                  ref={scrollRef}
                  className={`flex ${isMe ? "justify-end" : "justify-start"} animate-fadeInUp`}
                  style={{ animationDelay: `${idx * 30}ms` }}
                >
                  <div
                    className={`relative group max-w-[70%] ${!isMe && showAvatar ? "ml-8" : ""}`}
                  >
                    {/* Sender name for group chat */}
                    {isGroup && !isMe && (
                      <div className="flex items-center gap-2 mb-1 ml-2">
                        <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[#00848c] to-[#fec20f] flex items-center justify-center">
                          <span className="text-[10px] font-bold text-white">
                            {msg.sender?.name?.[0]?.toUpperCase() || "U"}
                          </span>
                        </div>
                        <p className="text-xs font-semibold text-[#00848c] dark:text-[#00848c]">
                          {msg.sender?.name || "Unknown"}
                        </p>
                      </div>
                    )}

                    {/* Avatar for non-group chats */}
                    {!isGroup && !isMe && showAvatar && (
                      <div className="absolute -left-8 bottom-0 w-6 h-6 rounded-full bg-gradient-to-br from-[#00848c] to-[#fec20f] flex items-center justify-center shadow-md">
                        <span className="text-[10px] font-bold text-white">
                          {msg.sender?.name?.[0]?.toUpperCase() || "U"}
                        </span>
                      </div>
                    )}

                    {/* Message Bubble */}
                    <div
                      className={`relative px-4 py-2.5 rounded-2xl shadow-sm break-words transition-all duration-200 ${
                        isMe
                          ? "bg-gradient-to-r from-[#00848c] to-[#006b72] text-white rounded-br-md"
                          : "bg-gray-100 dark:bg-white/10 text-gray-800 dark:text-white/90 rounded-bl-md"
                      }`}
                    >
                      {/* EDIT MODE */}
                      {editingId === msg._id ? (
                        <div className="flex gap-2">
                          <input
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            className="flex-1 px-3 py-1 rounded-lg bg-white/20 text-white placeholder-white/50"
                            autoFocus
                          />
                          <button
                            onClick={saveEdit}
                            className="px-3 py-1 bg-white/20 rounded-lg hover:bg-white/30 transition"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="px-3 py-1 bg-red-500/50 rounded-lg hover:bg-red-500/70 transition"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <>
                          {/* TEXT MESSAGE */}
                          {msg.message && !msg.fileUrl && (
                            <p className="text-sm leading-relaxed">
                              {msg.message}
                            </p>
                          )}

                          {/* IMAGE PREVIEW */}
                          {msg.fileUrl && msg.fileType?.startsWith("image") && (
                            <div className="mt-1">
                              <img
                                src={`${backendURL}${msg.fileUrl}`}
                                className="max-w-[250px] max-h-[200px] rounded-xl object-cover cursor-pointer hover:opacity-90 transition"
                                alt="Shared"
                              />
                            </div>
                          )}

                          {/* FILE ATTACHMENT */}
                          {msg.fileUrl &&
                            !msg.fileType?.startsWith("image") && (
                              <a
                                href={`${backendURL}${msg.fileUrl}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 mt-1 px-3 py-1.5 bg-white/20 rounded-lg hover:bg-white/30 transition text-sm"
                              >
                                <FaFile size={14} />
                                <span>Download File</span>
                              </a>
                            )}

                          {/* Timestamp */}
                          <div
                            className={`flex items-center justify-end gap-1 mt-1 text-[10px] ${isMe ? "text-white/50" : "text-gray-400"}`}
                          >
                            <span>{formatTime(msg.createdAt)}</span>
                            {isMe && (
                              <FaCheck size={8} className="text-white/40" />
                            )}
                          </div>
                        </>
                      )}
                    </div>

                    {/* ACTION BUTTONS (Edit/Delete) */}
                    {isMe && editingId !== msg._id && (
                      <div className="absolute -top-6 right-0 hidden group-hover:flex gap-1 bg-gray-800/90 backdrop-blur-sm rounded-lg p-1 shadow-lg">
                        <button
                          onClick={() => {
                            setEditingId(msg._id);
                            setEditText(msg.message);
                          }}
                          className="p-1.5 rounded-md hover:bg-[#00848c] transition-colors"
                          title="Edit"
                        >
                          <FaEdit size={12} className="text-white" />
                        </button>
                        <button
                          onClick={() => deleteMsg(msg._id)}
                          className="p-1.5 rounded-md hover:bg-red-500 transition-colors"
                          title="Delete"
                        >
                          <FaTrash size={12} className="text-white" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
          <div ref={scrollRef} />
        </div>

        {/* TYPING INDICATOR */}
        {isTyping && !isGroup && (
          <div className="px-6 py-2">
            <div className="flex items-center gap-2">
              <div
                className="w-2 h-2 rounded-full bg-[#00848c] animate-bounce"
                style={{ animationDelay: "0ms" }}
              ></div>
              <div
                className="w-2 h-2 rounded-full bg-[#00848c] animate-bounce"
                style={{ animationDelay: "150ms" }}
              ></div>
              <div
                className="w-2 h-2 rounded-full bg-[#00848c] animate-bounce"
                style={{ animationDelay: "300ms" }}
              ></div>
              <span className="text-xs text-gray-500 dark:text-white/40 ml-1">
                Typing...
              </span>
            </div>
          </div>
        )}

        {/* FILE PREVIEW */}
        {file && (
          <div className="mx-6 mb-2 p-2 bg-gray-100 dark:bg-white/5 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-2">
              {file.type.startsWith("image") ? (
                <FaImage className="text-[#00848c]" />
              ) : (
                <FaFile className="text-[#00848c]" />
              )}
              <span className="text-sm text-gray-600 dark:text-white/60">
                {file.name}
              </span>
            </div>
            <button
              onClick={() => {
                setFile(null);
                setFileName("");
              }}
              className="p-1 rounded-lg hover:bg-gray-200 dark:hover:bg-white/10 transition"
            >
              <IoMdClose size={16} className="text-gray-500" />
            </button>
          </div>
        )}

        {/* INPUT AREA */}
        <div className="p-4 bg-white/50 dark:bg-white/5 border-t border-gray-200 dark:border-white/10">
          <div className="flex items-center gap-3">
            {/* File Attachment Button */}
            <label className="cursor-pointer group">
              <input
                type="file"
                hidden
                onChange={(e) => {
                  setFile(e.target.files[0]);
                  setFileName(e.target.files[0]?.name);
                }}
              />
              <div className="p-2.5 rounded-xl bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-white/60 hover:bg-[#00848c] hover:text-white transition-all duration-300">
                <FaPaperclip size={18} />
              </div>
            </label>

            {/* Message Input */}
            <input
              value={message}
              onChange={handleTyping}
              onKeyPress={(e) => e.key === "Enter" && sendMessage()}
              className="flex-1 px-4 py-2.5 bg-gray-100 dark:bg-white/10 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00848c] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-white/30 transition-all duration-200"
              placeholder="Type your message..."
            />

            {/* Send Button */}
            <button
              onClick={sendMessage}
              disabled={!message.trim() && !file}
              className="p-2.5 rounded-xl bg-gradient-to-r from-[#00848c] to-[#006b72] text-white hover:from-[#fec20f] hover:to-[#e5b00d] hover:text-[#1c1f4c] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#00848c]/25"
            >
              <FaPaperPlane size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
