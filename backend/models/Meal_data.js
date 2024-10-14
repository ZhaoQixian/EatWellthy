const mongoose = require("mongoose");

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

module.exports = mongoose.model("Meal_data", Meal_Schema);
