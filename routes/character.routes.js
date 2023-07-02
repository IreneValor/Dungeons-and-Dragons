const express = require("express");
const router = express.Router();
const Character = require("../models/Character.model");
const Contraption = require("../models/Contraption.model");
const Spell = require("../models/Spell.model");

// TRAER TODOS LOS PERSONAJES
router.get("/", async (req, res) => {
  try {
    const characters = await Character.find();
    return res.status(200).json(characters);
  } catch (error) {
    return res.status(500).json({ error: "Error al obtener los personajes" });
  }
});

// TRAER PERSONAJE POR ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const character = await Character.findById(id)
      .populate("spellbook.spells")
      .populate("contraptions");

    if (!character) {
      return res.status(404).json({ message: "Personaje no encontrado" });
    }

    return res.status(200).json(character);
  } catch (error) {
    return res.status(500).json({ error: "Error al obtener el personaje" });
  }
});

// CREAR NUEVO PERSONAJE (CON USER)
router.post("/", async (req, res) => {
  try {
    const { name, userId, level, classs, contraptions, spells } = req.body;
    const character = new Character({
      name,
      user: userId,
      level,
      classs,
      contraptions: contraptions || [],
      "spellbook.spells": spells || [],
    });

    await character.save();
    return res.status(201).json(character);
  } catch (error) {
    return res.status(500).json({ error: "Error al crear el personaje" });
  }
});

// ACTUALIZAR PERSONAJE (CONTRAPTIONS Y SPELLS) POR ID
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, contraptions, spells } = req.body;

    const character = await Character.findByIdAndUpdate(
      id,
      { name },
      { new: true }
    );

    if (!character) {
      return res.status(404).json({ message: "Personaje no encontrado" });
    }

    const updatedContraptions = await Contraption.updateMany(
      { _id: { $in: contraptions } },
      { $set: { character: id } }
    );

    const updatedSpells = await Spell.updateMany(
      { _id: { $in: spells } },
      { $set: { character: id } }
    );

    return res.status(200).json({
      character,
      updatedContraptions,
      updatedSpells,
    });
  } catch (error) {
    return res.status(500).json({ error: "Error al actualizar el personaje" });
  }
});

// ELIMINAR EL PERSONAJE POR ID
router.delete("/:id", async (req, res) => {
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

// AÑADIR CONTRAPTION A UN PERSONAJE
router.post("/:characterId/addContraption", async (req, res) => {
  try {
    const { characterId } = req.params;
    const { contraptionId } = req.body;

    const character = await Character.findById(characterId);
    if (!character) {
      return res.status(404).json({ message: "Personaje no encontrado" });
    }

    const contraption = await Contraption.findById(contraptionId);
    if (!contraption) {
      return res.status(404).json({ message: "Contraption no encontrado" });
    }

    character.contraptions.push(contraptionId);
    await character.save();

    return res.status(200).json(character);
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Error al añadir el contraption al personaje" });
  }
});
// ELIMINAR CONTRAPTION DE UN PERSONAJE
router.delete(
  "/:characterId/removeContraption/:contraptionId",
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

      // Eliminar la creación del personaje
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


// ELIMINAR CONTRAPTION DE UN PERSONAJE
router.delete(
  "/:characterId/removeContraption/:contraptionId",
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
        (id) => id !== contraptionId
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


// AÑADIR SPELL AL SPELLBOOK DE UN PERSONAJE
router.post("/:characterId/addSpell", async (req, res) => {
  try {
    const { characterId } = req.params;
    const { spellId } = req.body;

    const character = await Character.findById(characterId);
    if (!character) {
      return res.status(404).json({ message: "Personaje no encontrado" });
    }

    const spell = await Spell.findById(spellId);
    if (!spell) {
      return res.status(404).json({ message: "Hechizo no encontrado" });
    }

    const newSpell = {
      spell: spellId,
      isFavorite: false,
    };

    character.spellbook.push(newSpell);
    await character.save();

    return res.status(200).json(character);
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Error al añadir el hechizo al personaje" });
  }
});

// ELIMINAR SPELL DEL SPELLBOOK DE UN PERSONAJE

router.delete("/:characterId/removeSpell/:spellId", async (req, res) => {
  try {
    const { characterId, spellId } = req.params;

    const character = await Character.findByIdAndUpdate(
      characterId,
      { $pull: { spellbook: { spell: spellId } } },
      { new: true }
    );

    if (!character) {
      return res.status(404).json({ message: "Personaje no encontrado" });
    }

    return res.status(200).json({ message: "SPELL DEL SPELLBOOK BORRADO" });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Error al eliminar el hechizo del personaje" });
  }
});



// TRAER FAVORITOS Y CREACIONES DEL PERSONAJE
router.get("/:id/favorites", async (req, res) => {
  try {
    const { id } = req.params;
    const character = await Character.findById(id)
      .populate("spellbook.spell", "name") // Agrega solo el nombre del hechizo al populate
      .populate("contraptions", "name"); // Agrega solo el nombre de la creación al populate

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

// MARCAR HECHIZO COMO FAVORITO
router.put("/:characterId/favoriteSpell/:spellId", async (req, res) => {
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
});

// DESMARCAR HECHIZO COMO FAVORITO
router.put("/:characterId/unfavoriteSpell/:spellId", async (req, res) => {
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
});

// ...

module.exports = router;
