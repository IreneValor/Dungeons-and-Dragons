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
    DESC: {
      type: String,
      maxLength: 250,
    },
    isFavorite: {
      type: Boolean,
      default: false,
    },
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
    category_range: {
      type: String,
    },
    damage: {
      damage_dice: {
        type: String,
      },
      damage_type: {
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
    },
    desc: [String],
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
    index: {
      type: String,
    },
    properties: [
      {
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
    ],
    range: {
      long: {
        type: Number,
      },
      normal: {
        type: Number,
      },
    },
    special: [String], // Modificación para incluir la propiedad "special"
    url: {
      type: String,
    },
    weapon_category: {
      type: String,
    },
    weapon_range: {
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

