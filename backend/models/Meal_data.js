const crypto = require("crypto"); 

const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const Meal_Schema = new mongoose.Schema({
   
  owner: {
    type: String,
    required: false,
    unique: false,
  },
  meal_type:{
    type: String
  },
  food_taken: {
    type: String,
    required:true,
     
  },
  portion: {
    type: Number,
    default: 0.0,
  },
  time:{
    type: Date,
  }
});

// Static method to hash user names
Meal_Schema.statics.hashedOwner = (owner) =>
  crypto
    .createHash("sha256")
    .update(owner.toString() + process.env.HASH_SECRET)
    .digest("hex");

module.exports = mongoose.model("Meal_data", Meal_Schema);
