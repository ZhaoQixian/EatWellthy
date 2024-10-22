const mongoose = require("mongoose");

const ProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',  // This references your User model
    required: true,
    unique: true
  },
  age: {
    type: Number,
    min: 0,
    max: 150
  },
  height: {
    type: Number,
    min: 0,
    max: 300,  // in cm
  },
  weight: {
    type: Number,
    min: 0,
    max: 500,  // in kg
  },
  dailyBudget: {
    type: Number,
    min: 0,
  },
  dietaryPreferences: {
    type: String,
    trim: true,
    default: ""
  },
  allergies: [{
    type: String,
    trim: true
  }],
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
},
{
  timestamps: { 
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  }
});

// Middleware to handle the updatedAt field
ProfileSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = Profile = mongoose.model("profile", ProfileSchema);