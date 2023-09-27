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
    desc: [String],
    done: {
      type: Boolean,
      default: false,
    },
    cost: {
      quantity: {
        type: Number,
        default: 0,
      },
      unit: {
        type: String,
        default: "",
      },
    },
    characters: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Character",
      },
    ],
    damage_dice: {
      type: String,
    },
    equipment_category: {
      index: {
        type: String,
      },
      name: {
        type: String,
      },
      url: {
        type: String,
      },
    },
    gear_category_name: {

      type: String,
    },
    index: {
      type: String,
    },
    weight: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
  
);

const Contraption = model("Contraption", contraptionSchema);

module.exports = Contraption;
