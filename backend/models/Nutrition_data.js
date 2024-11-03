const mongoose = require("mongoose");
const dotenv = require("dotenv");
const crypto = require("crypto"); 
dotenv.config();
const Nutrition_Schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: false,
  },
  owner: {
    type: String,
    required: false,
    unique: false,
  },
  energy: {
    type: Number,
    default: 0.0,

  },
  fat: {
    type: Number,
    default: 0.0,
  },
  sugar: {
    type: Number,
    default: 0.0,
    
  },
  fiber: {
    type: Number,
    default: 0.0,
  },
  protein: {
    type: Number,
    default: 0.0,
  },
  sodium: {
    type: Number,
    default: 0.0,
  },
  vitamin_c: {
    type: Number,
    default: 0.0,
  },
  calcium: {
    type: Number,
    default: 0.0,
  },
  iron: {
    type: Number,
    default: 0.0,
  },
});
Nutrition_Schema.statics.hashedOwner = (owner) =>
  crypto
    .createHash("sha256")
    .update(owner.toString() + process.env.HASH_SECRET)
    .digest("hex");
module.exports = Nutrition_data = mongoose.model("Nutrition_data", Nutrition_Schema);
