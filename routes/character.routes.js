const express = require("express");
const axios = require("axios");
const router = express.Router();

const Character = require("../models/Character.model");
const Contraption = require("../models/Contraption.model");
const User = require("../models/User.model");
const Spell = require("../models/Spell.model");
const { isAuthenticated } = require("../middlewares/Token.middleware");
const Cloudinary = require("../config/cloudinaryConfig");

router.get("/", isAuthenticated, async (req, res) => {
  try {
    const userId = req.payload._id;
    const characters = await Character.find({ user: userId }).populate("user");
    return res.status(200).json(characters);
  } catch (error) {
    return res.status(500).json({ error: "Error al obtener los personajes" });
  }
});

router.get("/:id", isAuthenticated, async (req, res) => {
  try {
    const { id } = req.params;
    const character = await Character.findById(id)
      .populate("spellbook")
      .populate("contraptions");

    if (!character) {
      return res.status(404).json({ message: "Personaje no encontrado" });
    }

    return res.status(200).json(character);
  } catch (error) {
    return res.status(500).json({ error: "Error al obtener el personaje" });
  }
});

router.post("/", isAuthenticated, async (req, res) => {
  try {
    const userId = req.payload._id;
    const user = await User.findById(userId);
    const characterImage = req.body.image;

    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    y;

    const cloudinaryResult = await Cloudinary.uploader.upload(characterImage);

    const characterData = {
      ...req.body,
      image: cloudinaryResult.secure_url,
      user: user._id,
    };

    const character = new Character(characterData);
    await character.save();
    user.characters = [...user.characters, character._id];
    await user.save();
    return res.status(201).json(character);
  } catch (error) {
    return res.status(500).json({ error: "Error al crear el personaje" });
  }
});

router.post(
  "/",
  isAuthenticated,

  async (req, res) => {
    try {
      const { name, userId, level, classs, contraptions, spells } = req.body;
      const imagePath = req.file.path;

      const character = new Character({
        name,
        user: userId,
        level,
        classs,
        contraptions: contraptions || [],
        "spellbook.spells": spells || [],
        image: imagePath,
      });

      await character.save();
      return res.status(201).json(character);
    } catch (error) {
      return res.status(500).json({ error: "Error al crear el personaje" });
    }
  }
);
router.delete("/:id", isAuthenticated, async (req, res) => {
  try {
    const { id } = req.params;

    const character = await Character.findByIdAndDelete(id);

    if (!character) {
      return res.status(404).json({ message: "Personaje no encontrado" });
    }

    return res
      .status(200)
      .json({ message: `Personaje ${id} ha sido eliminado` });
  } catch (error) {
    return res.status(500).json({ error: "Error al eliminar el personaje" });
  }
});

router.post(
  "/:characterId/addContraptions",
  isAuthenticated,
  async (req, res) => {
    try {
      const { characterId } = req.params;
      const { contraptions } = req.body;
      const character = await Character.findById(characterId);

      if (!character) {
        return res.status(404).json({ message: "Personaje no encontrado" });
      }

      const contraptionsData = await Contraption.find({
        _id: { $in: contraptions },
      });

      if (contraptions.length !== contraptionsData.length) {
        return res
          .status(404)
          .json({ message: "Uno o más Contraptions no encontrados" });
      }

      character.contraptions.push(...contraptions);
      await character.save();

      const populatedCharacter = await Character.findById(characterId).populate(
        "contraptions"
      );

      return res.status(200).json(populatedCharacter);
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Error al añadir los Contraptions al personaje" });
    }
  }
);
router.put("/:id", isAuthenticated, async (req, res) => {
  try {
    const { id } = req.params;
    const updatedCharacterData = req.body; 

    const character = await Character.findByIdAndUpdate(
      id,
      updatedCharacterData,
      { new: true } 
    );

    if (!character) {
      return res.status(404).json({ message: "Personaje no encontrado" });
    }

    return res.status(200).json(character);
  } catch (error) {
    return res.status(500).json({ error: "Error al actualizar el personaje" });
  }
});

router.delete(
  "/:characterId/removeContraption/:contraptionId",
  isAuthenticated,
  async (req, res) => {
    try {
      const { characterId, contraptionId } = req.params;

      const character = await Character.findById(characterId);
      if (!character) {
        return res.status(404).json({ message: "Personaje no encontrado" });
      }

      const contraption = await Contraption.findById(contraptionId);
      if (!contraption) {
        return res.status(404).json({ message: "Contraption no encontrado" });
      }

      if (!character.contraptions.includes(contraptionId)) {
        return res
          .status(400)
          .json({ message: "El contraption no pertenece al personaje" });
      }

      character.contraptions = character.contraptions.filter(
        (id) => id.toString() !== contraptionId
      );

      await character.save();

      return res.status(200).json(character);
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Error al eliminar el contraption del personaje" });
    }
  }
);

router.post("/:characterId/addSpells", isAuthenticated, async (req, res) => {
  try {
    const { characterId } = req.params;
    const { spells } = req.body;
    const character = await Character.findById(characterId);

    if (!character) {
      return res.status(404).json({ message: "Personaje no encontrado" });
    }

    const spellsData = await Spell.find({
      _id: { $in: spells },
    });

    if (spells.length !== spellsData.length) {
      return res
        .status(404)
        .json({ message: "Uno o más spells no encontrados" });
    }

    character.spellbook.push(...spellsData);
    await character.save();

    const populatedCharacter = await Character.findById(characterId).populate(
      "spellbook"
    );

    return res.status(200).json(populatedCharacter);
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Error al añadir los spells al personaje" });
  }
});

router.delete(
  "/:characterId/removeSpell/:spellId",
  isAuthenticated,
  async (req, res) => {
    try {
      const { characterId, spellId } = req.params;
      const character = await Character.findById(characterId);

      if (!character) {
        return res.status(404).json({ message: "Personaje no encontrado" });
      }

      const spellIndex = character.spellbook.findIndex(
        (spell) => spell._id.toString() === spellId
      );

      if (spellIndex === -1) {
        return res
          .status(400)
          .json({ message: "El spell no pertenece al personaje" });
      }

      character.spellbook.splice(spellIndex, 1);

      await character.save();

      return res.status(200).json(character);
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Error al eliminar el spell del personaje" });
    }
  }
);

router.get("/:characterId/spells", isAuthenticated, async (req, res, next) => {
  try {
    const { characterId } = req.params;
    const character = await Character.findById(characterId);

    if (!character) {
      return res.status(404).json({ message: "Personaje no encontrado" });
    }

    const { classs, level } = character;

    const response = await axios.get(
      `https://www.dnd5eapi.co/api/spells?classes=${classs}&level=${level}`
    );

    const spells = response.data.results;
    return res.status(200).json(spells);
  } catch (error) {
    next(error);
  }
});

router.get("/:id/favorites", isAuthenticated, async (req, res) => {
  try {
    const { id } = req.params;
    const character = await Character.findById(id)
      .populate("spellbook.spell", "name")
      .populate("contraptions", "name");

    if (!character) {
      return res.status(404).json({ message: "Personaje no encontrado" });
    }

    const favorites = character.spellbook.filter((spell) => spell.isFavorite);
    const creations = character.contraptions;

    return res.status(200).json({ favorites, creations });
  } catch (error) {
    return res.status(500).json({
      error: "Error al obtener los favoritos y creaciones del personaje",
    });
  }
});

router.put(
  "/:characterId/favoriteSpell/:spellId",
  isAuthenticated,
  async (req, res) => {
    try {
      const { characterId, spellId } = req.params;

      const character = await Character.findById(characterId);
      if (!character) {
        return res.status(404).json({ message: "Personaje no encontrado" });
      }

      const spellIndex = character.spellbook.findIndex(
        (spell) => spell.spell.toString() === spellId
      );
      if (spellIndex === -1) {
        return res.status(404).json({
          message: "Hechizo no encontrado en el spellbook del personaje",
        });
      }

      character.spellbook[spellIndex].isFavorite = true;
      await character.save();

      return res.status(200).json(character);
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Error al marcar el hechizo como favorito" });
    }
  }
);

router.put(
  "/:characterId/unfavoriteSpell/:spellId",
  isAuthenticated,
  async (req, res) => {
    try {
      const { characterId, spellId } = req.params;

      const character = await Character.findById(characterId);
      if (!character) {
        return res.status(404).json({ message: "Personaje no encontrado" });
      }

      const spellIndex = character.spellbook.findIndex(
        (spell) => spell.spell.toString() === spellId
      );
      if (spellIndex === -1) {
        return res.status(404).json({
          message: "Hechizo no encontrado en el spellbook del personaje",
        });
      }

      character.spellbook[spellIndex].isFavorite = false;
      await character.save();

      return res.status(200).json(character);
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Error al desmarcar el hechizo como favorito" });
    }
  }
);

module.exports = router;
