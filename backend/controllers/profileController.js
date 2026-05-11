// controllers/profileController.js

import Profile from "../models/Profile.js";


// ✅ CREATE OR UPDATE PROFILE
export const createOrUpdateProfile = async (req, res) => {
  try {
    const { fullName, department, skills, bio, phone } = req.body;

    let profile = await Profile.findOne({ user: req.user.id });

    if (profile) {
      // UPDATE
      profile.fullName = fullName || profile.fullName;
      profile.department = department || profile.department;
      profile.skills = skills || profile.skills;
      profile.bio = bio || profile.bio;
      profile.phone = phone || profile.phone;

      if (req.file) {
        profile.profileImage = req.file.path;
      }

      await profile.save();

      return res.json({ message: "Profile updated", profile });
    }

    // CREATE
    profile = await Profile.create({
      user: req.user.id,
      fullName,
      department,
      skills,
      bio,
      phone,
      profileImage: req.file?.path
    });

    res.json({ message: "Profile created", profile });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ✅ GET MY PROFILE
export const getMyProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id })
      .populate("university advisor user");

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.json(profile);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ✅ GET PROFILE BY ID (for admins, advisors, etc.)
export const getProfileById = async (req, res) => {
  try {
    const profile = await Profile.findById(req.params.id)
      .populate("user university advisor");

    res.json(profile);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};