const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const Profile = require("../models/Profile");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

// Helper function to process allergies
const processAllergies = (allergies) => {
  if (Array.isArray(allergies)) {
    return allergies.map((allergy) => allergy.trim()).filter(Boolean);
  }
  if (typeof allergies === "string") {
    return allergies
      .split(",")
      .map((allergy) => allergy.trim())
      .filter(Boolean);
  }
  return [];
};

// @route    GET api/profile/me
// @desc     Get current user's profile
// @access   Private
router.get("/me", auth, async (req, res) => {
  try {
    console.log("User ID:", req.user.id); // Debug log
    const hashedUserId = Profile.hashUserId(req.user.id);
    let profile = await Profile.findOne({ userId: hashedUserId });

    if (!profile) {
      // Create a default profile if none exists
      const defaultProfile = {
        userId: hashedUserId,
        age: 0,
        gender: null,
        height: 0,
        weight: 0,
        targetWeight: 0,
        dailyBudget: 0,
        dietaryPreferences: "",
        allergies: [],
        activityLevel: "sedentary",
        dietPlan: "maintenance",
      };

      profile = new Profile(defaultProfile);
      await profile.save();
      console.log("Created default profile:", profile); // Debug log
    }

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route    POST api/profile
// @desc     Create or update a user's profile
// @access   Private
router.post("/", auth, async (req, res) => {
  try {
    console.log("Received profile data:", req.body); // Debug log
    const {
      age,
      gender,
      height,
      weight,
      targetWeight,
      dailyBudget,
      dietaryPreferences,
      allergies,
      activityLevel,
      dietPlan,
    } = req.body;

    const hashedUserId = Profile.hashUserId(req.user.id);

    // Build profile object
    const profileFields = {
      userId: hashedUserId,
      age: Number(age) || 0,
      gender: gender || null,
      height: Number(height) || 0,
      weight: Number(weight) || 0,
      targetWeight: Number(targetWeight) || 0,
      dailyBudget: Number(dailyBudget) || 0,
      dietaryPreferences: dietaryPreferences || "",
      allergies: processAllergies(allergies),
      activityLevel: activityLevel || "sedentary",
      dietPlan: dietPlan || "maintenance",
    };

    console.log("Processed profile fields:", profileFields); // Debug log

    let profile = await Profile.findOne({ userId: hashedUserId });

    if (profile) {
      // Update existing profile
      profile = await Profile.findOneAndUpdate(
        { userId: hashedUserId },
        { $set: profileFields },
        { new: true }
      );
      console.log("Updated profile:", profile); // Debug log
      return res.json(profile);
    }

    // Create new profile
    profile = new Profile(profileFields);
    await profile.save();
    console.log("Created new profile:", profile); // Debug log
    res.json(profile);
  } catch (err) {
    console.error("Profile creation/update error:", err.message);
    res.status(500).json({ msg: "Server Error", error: err.message });
  }
});

// @route    PUT api/profile
// @desc     Update user's profile
// @access   Private
router.put("/", auth, async (req, res) => {
  try {
    console.log("Received update data:", req.body); // Debug log
    const {
      age,
      gender,
      height,
      weight,
      targetWeight,
      dailyBudget,
      dietaryPreferences,
      allergies,
      activityLevel,
      dietPlan,
    } = req.body;

    const hashedUserId = Profile.hashUserId(req.user.id);
    let profile = await Profile.findOne({ userId: hashedUserId });

    if (!profile) {
      return res.status(400).json({ msg: "Profile not found" });
    }

    // Update fields
    if (age !== undefined) profile.age = Number(age);
    if (gender !== undefined) profile.gender = gender;
    if (height !== undefined) profile.height = Number(height);
    if (weight !== undefined) profile.weight = Number(weight);
    if (targetWeight !== undefined) profile.targetWeight = Number(targetWeight);
    if (dailyBudget !== undefined) profile.dailyBudget = Number(dailyBudget);
    if (dietaryPreferences !== undefined)
      profile.dietaryPreferences = dietaryPreferences;
    if (allergies !== undefined)
      profile.allergies = processAllergies(allergies);
    if (activityLevel !== undefined) profile.activityLevel = activityLevel;
    if (dietPlan !== undefined) profile.dietPlan = dietPlan;

    console.log("Updated profile data:", profile); // Debug log
    await profile.save();
    res.json(profile);
  } catch (err) {
    console.error("Profile update error:", err.message);
    res.status(500).json({ msg: "Server Error", error: err.message });
  }
});

// @route    DELETE api/profile
// @desc     Delete profile and user
// @access   Private
router.delete("/", auth, async (req, res) => {
  try {
    console.log("Deleting profile for user:", req.user.id); // Debug log
    const hashedUserId = Profile.hashUserId(req.user.id);

    // Delete the profile
    await Profile.findOneAndDelete({ userId: hashedUserId });
    await User.findByIdAndDelete(req.user.id);

    res.json({ msg: "Profile and user deleted" });
  } catch (err) {
    console.error("Profile deletion error:", err.message);
    res.status(500).json({ msg: "Server Error", error: err.message });
  }
});

// @route    PUT api/profile/updatepassword
// @desc     Update user's password
// @access   Private
router.put("/updatepassword", auth, async (req, res) => {
  const { password } = req.body;

  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Hash password before saving
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();

    res.json({ msg: "Password updated successfully" });
  } catch (err) {
    console.error("Password update error:", err.message);
    res.status(500).json({ msg: "Server Error", error: err.message });
  }
});

module.exports = router;
