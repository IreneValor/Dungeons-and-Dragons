const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const reviewSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  experienceId: {
    type: Schema.Types.ObjectId,
    ref: "Experience",
    required: true,
  },
  title: {
    type: String,
    required: true,
    maxlength: 20,
  },
  comment: {
    type: String,
    required: true,
    maxlength: 500,
  },
  rating: {
    type: Number,
    min: 0,
    max: 10,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  
});

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
