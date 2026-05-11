const CV = require("../models/CV");

// GET CV
exports.getCV = async (req, res) => {
  try {
    const cv = await CV.findOne({ userId: req.user._id });
    res.json(cv || {});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// CREATE / UPDATE CV
exports.saveCV = async (req, res) => {
  try {
    let cv = await CV.findOne({ userId: req.user._id });

    if (cv) {
      cv = await CV.findOneAndUpdate(
        { userId: req.user._id },
        req.body,
        { new: true }
      );
    } else {
      cv = new CV({
        userId: req.user._id,
        ...req.body,
      });
      await cv.save();
    }

    res.json(cv);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};