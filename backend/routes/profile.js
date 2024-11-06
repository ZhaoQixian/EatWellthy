const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const Profile = require("../models/Profile");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const axios = require("axios");  // Add this line at the top

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
        profileIcon: "bear" // Add default icon
      };

      profile = new Profile(defaultProfile);
      await profile.save();
      console.log("Created default profile:", profile);
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
    console.log("Received profile data:", req.body);
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
      profileIcon // Add profileIcon
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
      profileIcon: profileIcon || "bear" // Add profileIcon with default
    };

    console.log("Processed profile fields:", profileFields);

    let profile = await Profile.findOne({ userId: hashedUserId });

    if (profile) {
      // Update existing profile
      profile = await Profile.findOneAndUpdate(
        { userId: hashedUserId },
        { $set: profileFields },
        { new: true }
      );
      console.log("Updated profile:", profile);
      return res.json(profile);
    }

    // Create new profile
    profile = new Profile(profileFields);
    await profile.save();
    console.log("Created new profile:", profile);
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
    console.log("Received update data:", req.body);
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
      profileIcon // Add profileIcon
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
    if (profileIcon !== undefined) profile.profileIcon = profileIcon; // Add profileIcon update

    console.log("Updated profile data:", profile);
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
    console.log("Deleting profile for user:", req.user.id);
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

router.put("/update-name", auth, async (req, res) => {
  try {
      const { name } = req.body;

      // Find and update user
      const user = await User.findById(req.user.id);
      
      if (!user) {
          return res.status(404).json({ errors: [{ msg: 'User not found' }] });
      }

      user.name = name;
      await user.save();

      res.json({ name: user.name });
  } catch (err) {
      console.error('Error in update-name route:', err);
      res.status(500).json({ errors: [{ msg: 'Server error' }] });
  }
});


// Update the generate-diet route
router.post("/generate-diet", auth, async (req, res) => {
  try {
    console.log("Starting diet generation...");
    const hashedUserId = Profile.hashUserId(req.user.id);
    const profile = await Profile.findOne({ userId: hashedUserId });

    if (!profile) {
      console.log("Profile not found");
      return res.status(404).json({ msg: "Profile not found" });
    }

    console.log("Found profile:", profile);

    // Prepare prompt for ChatGPT
    const prompt = `Generate a daily diet plan for a person with:
      Age: ${profile.age}
      Gender: ${profile.gender}
      Height: ${profile.height}cm
      Weight: ${profile.weight}kg
      Target Weight: ${profile.targetWeight}kg
      Dietary Preferences: ${profile.dietaryPreferences}
      Allergies: ${profile.allergies.join(', ')}
      Activity Level: ${profile.activityLevel}
      Diet Plan Type: ${profile.dietPlan}

      Provide exactly 4 meals in this JSON format:
      {
        "meals": [
          {
            "meal": "Breakfast",
            "items": [
              { "food": "Food Name", "weight": "Weight in grams" }
            ]
          }
        ]
      }
      
      Include Breakfast, Lunch, Snack, and Dinner.
      Only food names and weights, no descriptions.
      Consider dietary preferences and allergies.`;

    console.log("Sending request to OpenAI...");
    
    // Call ChatGPT API with error handling
    try {
      const response = await axios.post('https://api.openai.com/v1/chat/completions', {
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        response_format: { type: "json_object" }
      }, {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_KEY}`,
          'Content-Type': 'application/json'
        }
      });

      console.log("OpenAI Response received");
      
      if (!response.data.choices || !response.data.choices[0]) {
        throw new Error("Invalid response from OpenAI");
      }

      const suggestions = JSON.parse(response.data.choices[0].message.content);
      console.log("Parsed suggestions:", suggestions);

      if (!suggestions.meals || !Array.isArray(suggestions.meals)) {
        throw new Error("Invalid meal format in response");
      }

      // Update profile with new suggestions
      profile.dietSuggestions = suggestions.meals;
      profile.lastDietSuggestionUpdate = new Date();
      await profile.save();

      console.log("Profile updated with new suggestions");
      res.json({
        ...profile.toObject(),
        dietSuggestions: suggestions.meals
      });

    } catch (openAiError) {
      console.error("OpenAI API Error:", openAiError);
      throw new Error("Failed to generate diet suggestions");
    }

  } catch (err) {
    console.error('Error in generate-diet route:', err);
    res.status(500).json({ 
      msg: "Error generating diet suggestions",
      error: err.message 
    });
  }
});

module.exports = router;