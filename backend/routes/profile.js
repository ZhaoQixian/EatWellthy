const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth"); // Auth middleware to protect routes
const Profile = require("../models/Profile"); // Import the Profile model

// @route    POST api/profile
// @desc     Create or update a user's profile
// @access   Private
router.post("/", auth, async (req, res) => {
  const { age, height, weight, dailyBudget, dietaryPreferences, allergies } =
    req.body;

  // Build profile object
  const profileFields = {
    userId: req.user.id,
    age,
    height,
    weight,
    dailyBudget,
    dietaryPreferences,
    allergies: allergies
      ? allergies.split(",").map((allergy) => allergy.trim())
      : [],
  };

  try {
    let profile = await Profile.findOne({ userId: req.user.id });

    if (profile) {
      // Update existing profile
      profile = await Profile.findOneAndUpdate(
        { userId: req.user.id },
        { $set: profileFields },
        { new: true }
      );
      return res.json(profile);
    }

    // Create new profile
    profile = new Profile(profileFields);
    await profile.save();
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route    GET api/profile/me
// @desc     Get current user's profile
// @access   Private
router.get("/me", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ userId: req.user.id });

    if (!profile) {
      return res.status(400).json({ msg: "No profile found for this user" });
    }

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route    DELETE api/profile
// @desc     Delete profile and user
// @access   Private
router.delete("/", auth, async (req, res) => {
  try {
    // Delete the profile
    await Profile.findOneAndRemove({ userId: req.user.id });

    // Optionally, you can delete the user as well if you have the User model available:
    // await User.findOneAndRemove({ _id: req.user.id });

    res.json({ msg: "Profile deleted" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
