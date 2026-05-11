// backend/server.js

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

// Models
const Chat = require("./models/Chat");
const ChatRoom = require("./models/ChatRoom");
const User = require("./models/User");

// Routes
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const studentRoutes = require("./routes/studentRoutes");
const cvRoutes = require("./routes/cvRoutes");
const matchRoutes = require("./routes/matchRoutes");
const internshipRoutes = require("./routes/internshipRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const universityRoutes = require("./routes/universityRoutes");
const advisorRoutes = require("./routes/advisorRoutes");
const companyRoutes = require("./routes/companyRoutes");
const supervisorRoutes = require("./routes/supervisorRoutes");
const chatRoutes = require("./routes/chatRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const profileRoutes = require("./routes/profileRoutes");
const reportRoutes = require("./routes/reportRoutes");
const verifyRoutes = require("./routes/verifyRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
// =====================
// APP SETUP
// =====================
const app = express();
app.use(express.json());
app.use(cors());

// Static files
const uploadsPath = path.join(__dirname, "uploads");
app.use("/uploads", express.static(uploadsPath));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/cv", cvRoutes);
app.use("/api/match", matchRoutes);
app.use("/api/internships", internshipRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/university", universityRoutes);
app.use("/api/advisor", advisorRoutes);
app.use("/api/company", companyRoutes);
app.use("/api/supervisor", supervisorRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/verify-account", verifyRoutes);
app.use("/api/payment", paymentRoutes);
// DB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected ✅"))
  .catch((err) => console.error("MongoDB Error:", err));

// =====================
// SERVER + SOCKET.IO
// =====================
const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

app.set("io", io);

// =====================
// SOCKET LOGIC (FIXED VERSION)
// =====================
let onlineUsers = {};

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // =====================
  // REGISTER USER (IMPORTANT)
  // =====================
  socket.on("register", (userId) => {
    if (!userId) return;

    socket.userId = userId;
    onlineUsers[userId] = socket.id;

    // auto join notification room
    socket.join(userId);

    io.emit("onlineUsers", Object.keys(onlineUsers));

    console.log("🔵 Registered user:", userId);
  });

  // =====================
  // JOIN NOTIFICATION ROOM (FIXED)
  // =====================
  socket.on("joinNotification", (userId) => {
    if (!userId) return;

    socket.userId = userId;
    socket.join(userId);

    console.log("🔔 Joined notification room:", userId);
  });

  // =====================
  // CHAT ROOM
  // =====================
  socket.on("joinRoom", (roomId) => {
    socket.join(roomId);
  });

  socket.on("sendMessage", async ({ roomId, message }) => {
    try {
      if (!roomId || !message) return;

      const chat = await Chat.create({
        room: roomId,
        sender: socket.userId,
        message,
      });

      const populated = await chat.populate("sender", "name email");

      io.to(roomId).emit("newMessage", populated);
    } catch (err) {
      console.error("SEND ERROR:", err);
    }
  });

  socket.on("editMessage", async ({ messageId, newText, roomId }) => {
    try {
      const updated = await Chat.findByIdAndUpdate(
        messageId,
        { message: newText, edited: true },
        { new: true }
      ).populate("sender", "name email");

      if (updated) {
        io.to(roomId).emit("messageUpdated", updated);
      }
    } catch (err) {
      console.error("EDIT ERROR:", err);
    }
  });

  socket.on("deleteMessage", async ({ messageId, roomId }) => {
    try {
      const deleted = await Chat.findByIdAndDelete(messageId);

      if (deleted) {
        io.to(roomId).emit("messageDeleted", messageId);
      }
    } catch (err) {
      console.error("DELETE ERROR:", err);
    }
  });

  // =====================
  // DISCONNECT
  // =====================
  socket.on("disconnect", () => {
    if (socket.userId) {
      delete onlineUsers[socket.userId];
    }

    io.emit("onlineUsers", Object.keys(onlineUsers));

    console.log("User disconnected:", socket.id);
  });
});

// =====================
// START SERVER
// =====================
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT} 🚀`);
});