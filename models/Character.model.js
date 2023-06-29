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
  class: {
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

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  spellbook: [
    //AQUI LO RELACIONO CON EL MODELO HECHIZO
    {
      spell: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Spell",
      },
      isFavorite: {
        // LE PASO EL BOOLEANO , MARCO EL HECHIZO COMO FAVORITO
        type: Boolean,
        default: false,
      },
    },
  ],
  contraptions: [
    //AQUI LO RELACIONO CON EL MODELO ARTILUGIOS
    {
      type: Schema.Types.ObjectId,
      ref: "Contraption",
    },
  ],
});

const Character = model("Character", characterSchema);

module.exports = Character;
