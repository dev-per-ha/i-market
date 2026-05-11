// backend/server.js

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");
// Models
// =====================
const Chat = require("./models/Chat");
const ChatRoom = require("./models/ChatRoom");
const User = require("./models/User");

// =====================
// Routes
// =====================
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

// =====================
// App Setup
// =====================
const app = express();

// =====================
// Middleware
// =====================
app.use(express.json());
app.use(cors());

// =====================
// STATIC FILES (UPLOADS FIX)
// =====================
const uploadsPath = path.join(__dirname, "uploads");

// IMPORTANT: This is the ONLY correct static setup
app.use("/uploads", express.static(uploadsPath));

// =====================
// ROUTES
// =====================
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

// =====================
// DATABASE CONNECTION
// =====================
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
// ✅ Initialize notification socket
app.set("io", io);

// =====================
// SOCKET LOGIC
// =====================
let onlineUsers = {};

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Register user online
  socket.on("register", (userId) => {
    socket.userId = userId;
    onlineUsers[userId] = socket.id;
    io.emit("onlineUsers", Object.keys(onlineUsers));
  });

  // Join room
  socket.on("joinRoom", (roomId) => {
    socket.join(roomId);
  });

  // Send message
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

  // Edit message
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
   // 🔔 Join personal notification room
  socket.on("joinNotification", (userId) => {
  if (!userId) return;

  socket.join(userId);
  socket.userId = userId; // 🔥 IMPORTANT FIX
  console.log("🔔 Joined notification room:", userId);
});
  // Delete message
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

  // Disconnect
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