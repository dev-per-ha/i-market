const Chat = require("../models/Chat");
const ChatRoom = require("../models/ChatRoom");
const path = require("path");
const fs = require("fs");
const createNotification = require("../utils/createNotification");
const notificationEngine = require("../utils/notificationEngine");
// ================= GET MY CHATS =================
exports.getMyChats = async (req, res) => {
  try {
    const chats = await ChatRoom.find({
      members: req.user._id,
    })
      .populate("members", "name email role")
      .sort({ updatedAt: -1 });

    res.json(chats);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// ================= ACCESS 1-TO-1 CHAT =================
exports.accessChat = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId)
      return res.status(400).json({ message: "UserId required" });

    let chat = await ChatRoom.findOne({
      isGroup: false,
      members: { $all: [req.user._id, userId] },
      $expr: { $eq: [{ $size: "$members" }, 2] },
    }).populate("members", "name email");

    if (chat) return res.json(chat);

    chat = await ChatRoom.create({
      isGroup: false,
      members: [req.user._id, userId],
    });

    chat = await chat.populate("members", "name email");

    res.status(201).json(chat);
  } catch (err) {
    console.error("ACCESS CHAT ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ================= CREATE GROUP CHAT =================
exports.createGroupChat = async (req, res) => {
  try {
    const { advisorId, supervisorId } = req.body;

    if (!advisorId || !supervisorId)
      return res.status(400).json({ message: "Select users" });

    const members = [req.user._id, advisorId, supervisorId];

    let group = await ChatRoom.findOne({
      isGroup: true,
      members: { $all: members },
      $expr: { $eq: [{ $size: "$members" }, 3] },
    });

    if (group) return res.json(group);

    group = await ChatRoom.create({
      isGroup: true,
      groupName: "Internship Group",
      members,
    });

    group = await group.populate("members", "name email");

    res.status(201).json(group);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// ================= GET CHAT BY ID WITH MESSAGES =================
exports.getChatById = async (req, res) => {
  try {
    const chat = await ChatRoom.findById(req.params.id)
      .populate("members", "name email")
      .lean();

    const messages = await Chat.find({ room: req.params.id })
      .populate("sender", "name email")
      .sort({ createdAt: 1 })
      .lean();

    res.json({ ...chat, messages });
  } catch (err) {
    console.error("GET CHAT ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ================= SEND MESSAGE WITH FILE SUPPORT =================
exports.sendMessage = async (req, res) => {
  try {
    const { roomId, message } = req.body;
    const sender = req.user._id;

    if (!roomId || (!message && !req.file)) {
      return res.status(400).json({
        message: "Message or file required",
      });
    }

    let fileUrl = null;
    let fileType = null;

    if (req.file) {
      fileUrl = `/uploads/${req.file.filename}`;
      fileType = req.file.mimetype;
    }

    // ================= CREATE MESSAGE =================
    const newMessage = await Chat.create({
      room: roomId,
      sender,
      message: message || "",
      fileUrl,
      fileType,
    });

    const populatedMessage = await Chat.findById(newMessage._id)
      .populate("sender", "name email");

    const io = req.app.get("io");

    // ================= GET ROOM MEMBERS =================
    const room = await ChatRoom.findById(roomId)
      .populate("members", "_id name");

    // ================= REAL-TIME MESSAGE =================
    io.to(roomId).emit("newMessage", populatedMessage);

    // ================= FILTER RECIPIENTS =================
    const recipients = room.members.filter(
      (m) => m._id.toString() !== sender.toString()
    );

    // ================= 🔔 NOTIFICATION ENGINE =================
    await notificationEngine(
      "NEW_MESSAGE",
      {
        recipients,
        sender: populatedMessage.sender,
        roomId,
      },
      io
    );

    // ================= RESPONSE =================
    res.status(201).json(populatedMessage);

  } catch (err) {
    console.error("SEND MESSAGE ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✏️ EDIT MESSAGE
exports.editMessage = async (req, res) => {
  try {
    const { message } = req.body;

    const updated = await Chat.findByIdAndUpdate(
      req.params.messageId,
      { message, edited: true },
      { new: true }
    ).populate("sender", "name email");

    if (!updated) {
      return res.status(404).json({ message: "Message not found" });
    }

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🗑 DELETE MESSAGE
exports.deleteMessage = async (req, res) => {
  try {
    const deleted = await Chat.findByIdAndDelete(req.params.messageId);

    if (!deleted) {
      return res.status(404).json({ message: "Message not found" });
    }

    res.json({ success: true, messageId: req.params.messageId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};