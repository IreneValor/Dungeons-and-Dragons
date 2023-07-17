const express = require("express");
const router = express.Router();
const axios = require("axios");
const Character = require("../models/Character.model");
const Contraption = require("../models/Contraption.model");
const User = require("../models/User.model");
const Spell = require("../models/Spell.model");
const {
  isAuthenticated,
  uploadMiddleware,
} = require("../middlewares/Token.middleware");

// TRAER TODOS LOS PERSONAJES
router.get("/", isAuthenticated, async (req, res) => {
  try {
    const userId = req.payload._id;
    console.log(userId, "userid");
    const characters = await Character.find({ user: userId }).populate("user");
    return res.status(200).json(characters);
  } catch (error) {
    return res.status(500).json({ error: "Error al obtener los personajes" });
  }
});

// TRAER PERSONAJE POR ID
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

// CREAR NUEVO PERSONAJE (CON USER)
router.post("/", isAuthenticated, async (req, res) => {
  try {
    const userId = req.payload._id; // Obtener el ID del usuario autenticado

    const user = await User.findById(userId); // Buscar el usuario en la base de datos

    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const characterData = {
      ...req.body,
      image: req.file ? req.file.path : null,
      user: user._id, // Asignar el ID del usuario al personaje
    };

    const character = new Character(characterData);

    await character.save();

    user.characters = [...user.characters, character._id]; // Agregar el ID del personaje al array de personajes del usuario

    await user.save();

    return res.status(201).json(character);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Error al crear el personaje" });
  }
});

// ELIMINAR EL PERSONAJE POR ID
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

// AÑADIR CONTRAPTION A UN PERSONAJE

router.post(
  "/:characterId/addContraptions",
  isAuthenticated,
  async (req, res) => {
    try {
      const { characterId } = req.params;
      const { contraptions } = req.body;

      console.log("CHARACTERID:", characterId);
      console.log("CONTRAPTIONS:", contraptions);

      const character = await Character.findById(characterId);
      console.log("CHARACTER:", character);

      if (!character) {
        console.log("Personaje no encontrado");
        return res.status(404).json({ message: "Personaje no encontrado" });
      }

      const contraptionsData = await Contraption.find({
        _id: { $in: contraptions },
      });
      console.log("CONSTRAPTIONSDATA:", contraptionsData);

      if (contraptions.length !== contraptionsData.length) {
        console.log("Uno o más Contraptions no encontrados");
        return res
          .status(404)
          .json({ message: "Uno o más Contraptions no encontrados" });
      }

      character.contraptions.push(...contraptions); //puedo padar el idContraption o os IDs de los contraptions en un arreglo y utilizar el spread operator para pasarlos como argumentos individuales
      console.log("Character updated", character);
      await character.save();

      const populatedCharacter = await Character.findById(characterId).populate(
        "contraptions"
      );
      console.log("populatedCharacter:", populatedCharacter);

      return res.status(200).json(populatedCharacter);
    } catch (error) {
      console.log("Error al añadir los Contraptions al personaje:", error);
      return res
        .status(500)
        .json({ error: "Error al añadir los Contraptions al personaje" });
    }
  }
);
//BORRAR CONTRAPTION PERSONAJE
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

// AÑADIR SPELL AL SPELLBOOK DE UN PERSONAJE
router.post("/:characterId/addSpells", isAuthenticated, async (req, res) => {
  try {
    const { characterId } = req.params;
    const { spells } = req.body;

    console.log("characterId:", characterId);
    console.log("spells:", spells);

    const character = await Character.findById(characterId);
    console.log("character:", character);

    if (!character) {
      console.log("Personaje no encontrado");
      return res.status(404).json({ message: "Personaje no encontrado" });
    }

    const spellsData = await Spell.find({
      _id: { $in: spells },
    });
    console.log("spellsData:", spellsData);

    if (spells.length !== spellsData.length) {
      console.log("Uno o más spells no encontrados");
      return res
        .status(404)
        .json({ message: "Uno o más spells no encontrados" });
    }

    character.spellbook.push(...spells);
    console.log("Character updated", character);
    await character.save();

    const populatedCharacter = await Character.findById(characterId).populate(
      "spellbook"
    );
    console.log("populatedCharacter:", populatedCharacter);

    return res.status(200).json(populatedCharacter);
  } catch (error) {
    console.log("Error al añadir los spells al personaje:", error);
    return res
      .status(500)
      .json({ error: "Error al añadir los spells al personaje" });
  }
});

// ELIMINAR SPELL DEL SPELLBOOK DE UN PERSONAJE
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
        //POR LA PROPIEDAD ISFAVORITE
        (item) => item._id.toString() === spellId
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

// OBTENER HECHIZOS API EXTARNA SEGUN NIVEL Y RAZA
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

// TRAER FAVORITOS Y CREACIONES DEL PERSONAJE
router.get("/:id/favorites", isAuthenticated, async (req, res) => {
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

// DESMARCAR HECHIZO COMO FAVORITO
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
// router.post(
//   "/",
//   isAuthenticated,
//   // uploadMiddleware,
//   async (req, res) => {
//     //uploadMiddleware porque es el nombre que le he puesto
//     try {
//       const { name, userId, level, classs, contraptions, spells } = req.body;

//       // Obtener la ubicación del archivo guardado por Multer
//       const imagePath = req.file.path;

//       const character = new Character({
//         name,
//         user: userId,
//         level,
//         classs,
//         contraptions: contraptions || [],
//         "spellbook.spells": spells || [],
//         image: imagePath,
//       });

//       await character.save();
//       return res.status(201).json(character);
//     } catch (error) {
//       console.log(error);
//       return res.status(500).json({ error: "Error al crear el personaje" });
//     }
//   }
// );
// CREAR NUEVO PERSONAJE (CON USER)
// router.post("/", isAuthenticated, async (req, res) => {
//   try {
//     const { name, userId, level, classs, contraptions, spells } = req.body;
//     console.log(req.body);
//     const character = new Character({
//       name,
//       user: userId,
//       level,
//       classs,
//       contraptions: contraptions || [],
//       "spellbook.spells": spells || [],
//       image: null,
//     });

//     await character.save();
//     return res.status(201).json(character);
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({ error: "Error al crear el personaje" });
//   }
// });
