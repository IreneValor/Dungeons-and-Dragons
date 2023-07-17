const mongoose = require("mongoose");
const { Schema, model } = mongoose;
const User = require("./User.model");
const Character = require("./Character.model");

const contraptionSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
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
    isFavorite: {
      type: Boolean,
      default: false,
    },
    characters: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Character",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Contraption = model("Contraption", contraptionSchema);

module.exports = Contraption;
