const moment = require("moment");
const mongoose = require("mongoose");
const crypto = require("crypto");
const dotenv = require("dotenv");

dotenv.config();

const EventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please write a title for your event"],
  },
  start: {
    type: Date,
    required: [true, "Please Insert The Start of your event"],
    // min: [new Date(), "can't be before now!!"],
  },
  end: {
    type: Date,
    required: [true, "Please Insert The Start of your event"],
    //setting a min function to accept any date one hour ahead of start
    // min: [
    //   function () {
    //     const date = new Date(this.start);
    //     const validDate = new Date(date.setHours(date.getHours() + 1));
    //     return validDate;
    //   },
    //   "Event End must be at least one hour a head of event time",
    // ],
    // default: function () {
    //   const date = new Date(this.start);
    //   return date.setDate(date.getDate() + 1);
    // },
  },
  describe: { type: String },
  userId: {
    type: String,
    required: true,
  },
});

// Static method to hash user IDs
EventSchema.statics.hashedUserId = (userId) =>
  crypto
    .createHash("sha256")
    .update(userId.toString() + process.env.HASH_SECRET)
    .digest("hex");

module.exports = Event = mongoose.model("event", EventSchema);
