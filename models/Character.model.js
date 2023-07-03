const mongoose = require("mongoose");
const { Schema, model } = mongoose;
const Spell = require("./Spell.model");
const Contraption = require("./Contraption.model");

const characterSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  race: {
    type: String,
  },
  classs: {
    type: String,
    required: true,
  },
  abilityScores: {
    strength: {
      type: Number,
    },
    dexterity: {
      type: Number,
    },
    constitution: {
      type: Number,
    },
    intelligence: {
      type: Number,
    },
    wisdom: {
      type: Number,
    },
    charisma: {
      type: Number,
    },
  },
  level: {
    type: Number,
    required: true,
  },
  spellbook: [
    {
      spell: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Spell",
      },
      isFavorite: {
        type: Boolean,
        default: false,
      },
    },
  ],
  contraptions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Contraption",
    },
  ],
  image: {
    type: String,
    default: null,
  },
});

const Character = model("Character", characterSchema);

module.exports = Character;
