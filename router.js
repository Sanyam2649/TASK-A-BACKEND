const express = require("express");
const router = express.Router();
const Profile = require("./model/user");

router.post("/create-profile", async (req, res) => {
  try {
    const { profileData } = req.body;

    if (!profileData?.email) {
      return res.status(400).json({ message: "Email is mandatory" });
    }

    const isExistingProfile = await Profile.findOne({ email: profileData.email });
    if (isExistingProfile) {
      return res.status(409).json({ message: "Profile already exists with the same email" });
    }

    const profile = await Profile.create(profileData);
    return res.status(201).json({
      message: "Profile created successfully",
      profile,
    });
  } catch (error) {
    console.error("Error creating profile:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

// Fetch profile by profileId in query or param
router.get("/get-profile", async (req, res) => {
  try {
    const profileId = req.query.profileId || req.params.profileId;
    if (!profileId) {
      return res.status(400).json({ message: "profileId is required in query or params" });
    }

    const profile = await Profile.findById(profileId);
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    return res.status(200).json({
      message: "Profile fetched successfully",
      profile,
    });
  } catch (error) {
    console.error("Error fetching profile:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

// Get all profiles
router.get("/get-all-profiles", async (req, res) => {
  try {
    const profiles = await Profile.find({});
    if (!profiles.length) {
      return res.status(404).json({ message: "No profiles found" });
    }
    return res.status(200).json({
      message: "All profiles fetched successfully",
      profiles,
    });
  } catch (error) {
    console.error("Error fetching all profiles:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

// Update profile by profileId in params
router.put("/update-profile", async (req, res) => {
  try {
    const profileId = req.query.profileId || req.params.profileId;
    const { profileData } = req.body;

    if (!profileData || Object.keys(profileData).length === 0) {
      return res.status(400).json({ message: "No profile data provided to update" });
    }

    const updatedProfile = await Profile.findByIdAndUpdate(
      profileId,
      { $set: profileData },
      { new: true, runValidators: true }
    );

    if (!updatedProfile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    return res.status(200).json({
      message: "Profile updated successfully",
      profile: updatedProfile,
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

// Fetch projects by profileId in query or param
router.get("/projects", async (req, res) => {
  try {
    const profileId = req.query.profileId || req.params.profileId;
    const { skill } = req.query;
    
    if(!skill) {
      return res.status(400).json({ message: "skill query parameter is required" });
    }

    if (!profileId) {
      return res.status(400).json({ message: "profileId is required in query or params" });
    }

    const profile = await Profile.findById(profileId);

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    let projects = profile.projects;

    if (skill) {
      projects = projects.filter(project =>
        project.skills.some(s => s.toLowerCase() === skill.toLowerCase())
      );
    }

    if (!projects.length) {
      return res.status(404).json({ message: "No Project Associated with the Skill" });
    }

    return res.status(200).json({
      message: "Projects fetched successfully",
      projects,
    });
  } catch (error) {
    console.error("Error fetching projects:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/profile-top-skills", async (req, res) => {
  try {
    const profileId = req.query.profileId || req.params.profileId;
    const limit = parseInt(req.query.limit);
    if (!profileId) {
      return res.status(400).json({ message: "profileId is required in query or params" });
    }
    const profile = await Profile.findById(profileId);
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }
    const skillCount = {};
    profile.skills.forEach(skill => {
      skillCount[skill] = (skillCount[skill] || 0) + 1;
    });
    profile.projects.forEach(project => {
      project.skills.forEach(skill => {
        skillCount[skill] = (skillCount[skill] || 0) + 1;
      });
    });
    const sortedSkills = Object.entries(skillCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([skill, count]) => ({ skill, count }));
    if (!sortedSkills.length) {
      return res.status(404).json({ message: "No skills found" });
    }
    return res.status(200).json({
      message: "Top skills fetched successfully",
      skills: sortedSkills,
    });
  }
  catch (error) {
    console.error("Error fetching profile top skills:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/skills/top", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit);

    const skills = await Profile.aggregate([
      {
        $project: {
          allSkills: { $setUnion: ["$skills", { $reduce: {
            input: "$projects",
            initialValue: [],
            in: { $setUnion: ["$$value", "$$this.skills"] }
          }}]}
        }
      },
      { $unwind: "$allSkills" },
      { $group: { _id: "$allSkills", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: limit }
    ]);

    if (!skills.length) {
      return res.status(404).json({ message: "No skills found" });
    }

    return res.status(200).json({
      message: "Top skills fetched successfully",
      skills,
    });
  } catch (error) {
    console.error("Error fetching top skills:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/search", async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({ message: "Search query is required" });
    }

    const profiles = await Profile.find({
      $or: [
        { name: { $regex: q, $options: "i" } },
        { email: { $regex: q, $options: "i" } },
        { skills: { $regex: q, $options: "i" } },
        { education: { $regex: q, $options: "i" } },
        { "projects.title": { $regex: q, $options: "i" } },
        { "projects.description": { $regex: q, $options: "i" } },
        { "projects.skills": { $regex: q, $options: "i" } },
        { "work.company": { $regex: q, $options: "i" } },
        { "work.role": { $regex: q, $options: "i" } },
        { "work.description": { $regex: q, $options: "i" } },
      ],
    });

    if (!profiles.length) {
      return res.status(404).json({ message: "No results found" });
    }

    return res.status(200).json({
      message: "Search results",
      results: profiles,
    });
  } catch (error) {
    console.error("Error in search:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
