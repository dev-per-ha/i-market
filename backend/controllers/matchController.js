const CV = require("../models/CV");
const Internship = require("../models/InternshipPost");

exports.getMatches = async (req, res) => {
  try {
    const cv = await CV.findOne({ userId: req.user._id });

    if (!cv) {
      return res.json([]);
    }

    const internships = await Internship.find();

    const matches = internships.map((internship) => {
      const required = internship.requiredSkills || [];
      const studentSkills = cv.skills || [];

      const matchedSkills = required.filter(skill =>
        studentSkills.includes(skill)
      );

      const matchPercentage =
        required.length > 0
          ? (matchedSkills.length / required.length) * 100
          : 0;

      return {
        ...internship._doc,
        matchPercentage: Math.round(matchPercentage),
      };
    });

    // Sort best matches first
    matches.sort((a, b) => b.matchPercentage - a.matchPercentage);

    res.json(matches);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};