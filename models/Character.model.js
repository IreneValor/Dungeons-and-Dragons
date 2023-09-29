const mongoose = require("mongoose");
const { Schema, model } = mongoose;


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
  },
  level: {
    type: Number,
    required: true,
  },
  background: {
    type: String,
  },
  alignment: {
    type: String,
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
  spellbook: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Spell",
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
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

module.exports = model("Character", characterSchema);
