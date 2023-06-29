const { Schema, model } = require("mongoose");
const Character = require("./Character.model");

const contraptionSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      maxLength: 250,
    },
    quantity: {
      type: Number,
    },
    done: {
      type: Boolean,
      default: false,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const Contraption = model("Contraption", contraptionSchema);

module.exports = Contraption;
