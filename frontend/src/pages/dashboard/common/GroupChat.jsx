import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import API from "../../services/api";

const socket = io("http://localhost:5000"); // backend server

const GroupChat = ({ chatRoomIds, userId }) => {
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState("");

  useEffect(() => {
    socket.emit("join", userId);

    socket.on("receiveMessage", (msg) => {
      setMessages((prev) => [
        ...prev,
        { ...msg, sender: { _id: msg.senderId } },
      ]);
    });

    return () => socket.off("receiveMessage");
  }, [userId]);

  const fetchMessages = async () => {
    const res = await API.post("/chat/messages", { userIds: chatRoomIds });
    setMessages(res.data);
  };

  useEffect(() => {
    fetchMessages();
  }, [chatRoomIds]);

  const sendMessage = async () => {
    if (!content) return;
    const msg = { content, chatRoom: chatRoomIds };
    await API.post("/chat/send", msg);
    setMessages((prev) => [...prev, { ...msg, sender: { _id: userId } }]);

    // Emit to Socket.IO
    chatRoomIds.forEach((id) => {
      if (id !== userId) {
        socket.emit("sendMessage", {
          senderId: userId,
          receiverId: id,
          content,
        });
      }
    });

    setContent("");
  };

  return (
    <div className="p-4 border rounded">
      <div className="h-64 overflow-y-auto mb-2 space-y-1">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={m.sender._id === userId ? "text-right" : "text-left"}
          >
            <span className="block p-1 bg-gray-200 rounded">{m.content}</span>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="input flex-1"
          placeholder="Type a message..."
        />
        <button onClick={sendMessage} className="btn">
          Send
        </button>
      </div>
    </div>
  );
};

export default GroupChat;
