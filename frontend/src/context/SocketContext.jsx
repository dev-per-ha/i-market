import React, { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [user, setUser] = useState(null);
  const [chatRooms, setChatRooms] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);

  // ======================
  // Get logged-in user
  // ======================
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);
  }, []);

  // ======================
  // SOCKET CONNECTION
  // ======================
  useEffect(() => {
    if (!user?._id) return;

    const s = io("https://i-marketbackend.onrender.com");
    setSocket(s);

    // register user
    s.emit("register", user._id);

    // join notification room (kept for backend routing)
    s.emit("joinNotification", user._id);

    // online users
    s.on("onlineUsers", (users) => {
      setOnlineUsers(users);
    });

    // chat rooms
    s.on("newChatRoom", (room) => {
      setChatRooms((prev) => [...prev, room]);
    });

    return () => {
      s.disconnect();
      s.off("onlineUsers");
      s.off("newChatRoom");
      s.off("new_notification");
    };
  }, [user]);

  return (
    <SocketContext.Provider
      value={{
        socket,
        user,
        chatRooms,
        onlineUsers,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
