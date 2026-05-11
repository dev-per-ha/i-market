// backend/controllers/chatRoomController.js
const ChatRoom = require("../models/ChatRoom");
const Internship = require("../models/InternshipPost");

exports.getUserRooms = async (req, res) => {
  try {
    const internship = await Internship.findById(req.params.internshipId)
      .populate("student advisor supervisor"); // assuming you have these in Internship model

    if (!internship) return res.status(404).json({ message: "Internship not found" });

    // Ensure only related users can access
    const userId = req.user._id.toString();
    const allowedIds = [
      internship.student?.toString(),
      internship.advisor?.toString(),
      internship.supervisor?.toString()
    ];
    if (!allowedIds.includes(userId)) return res.status(403).json({ message: "Access denied" });

    // Check if room already exists
    let room = await ChatRoom.findOne({ internship: internship._id });
    if (!room) {
      room = new ChatRoom({
        name: `Internship Chat - ${internship._id}`,
        participants: allowedIds,
        internship: internship._id
      });
      await room.save();
    }

    res.json(room);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create/get chat room" });
  }
};

// Create a room for a given internship
exports.createRoom = async (req, res) => {
  const { internshipId } = req.body;
   try {
    const room = await ChatRoom.findOne({ internship: req.params.internshipId });
    if (!room) return res.status(404).json({ message: "Chat room not found" });

    const messages = await ChatMessage.find({ room: room._id })
      .populate("sender", "name email role")
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch messages" });
  }
};