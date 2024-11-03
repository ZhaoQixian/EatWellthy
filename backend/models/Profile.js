const mongoose = require("mongoose");
const crypto = require("crypto");

const ProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
    },
    profileIcon: {
      type: String,
      enum: ["bear", "capybara", "cat", "dog", "otter", "panda", "rabbit", "tiger"],
      default: "capybara"
    },
    age: {
      type: Number,
      min: 0,
      max: 150,
    },
    gender: {
      type: String,
      enum: ["male", "female"],
      default: null,
    },
    height: {
      type: Number,
      min: 0,
      max: 300, // in cm
    },
    weight: {
      type: Number,
      min: 0,
      max: 500, // in kg
    },
    targetWeight: {
      type: Number,
      min: 0,
      max: 500, // in kg
    },
    dailyBudget: {
      type: Number,
      min: 0,
    },
    dietaryPreferences: {
      type: String,
      trim: true,
      default: "",
    },
    allergies: [
      {
        type: String,
        trim: true,
      },
    ],
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    activityLevel: {
      type: String,
      enum: ["sedentary", "lightly", "moderately", "very", "super"],
      default: "sedentary",
    },
    dietPlan: {
      type: String,
      enum: ["maintenance", "weightloss", "keto", "vegetarian"],
      default: "maintenance",
    },
    // In ProfileSchema, update the dietSuggestions field
    dietSuggestions: {
      type: [{
        meal: {
          type: String,
          enum: ['Breakfast', 'Lunch', 'Snack', 'Dinner']
        },
        items: [{
          food: String,
          weight: String
        }]
      }],
      default: []
    },
    lastDietSuggestionUpdate: {
      type: Date,
      default: null
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    }
  },
  {
    timestamps: {
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    },
  }
);

// Middleware to handle the updatedAt field
ProfileSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

// Static method to hash user IDs
ProfileSchema.statics.hashUserId = function (userId) {
  if (!process.env.HASH_SECRET) {
    throw new Error("HASH_SECRET environment variable is not set");
  }
  return crypto
    .createHash("sha256")
    .update(userId.toString() + process.env.HASH_SECRET)
    .digest("hex");
};

module.exports = Profile = mongoose.model("profile", ProfileSchema);