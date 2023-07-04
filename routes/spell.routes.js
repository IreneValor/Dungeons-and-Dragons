const router = require("express").Router();
const Spell = require("../models/Spell.model");
const Character = require("../models/Character.model");
const axios = require("axios");
const { isAuthenticated } = require("../middlewares/Token.middleware");

// Traer todos los hechizos con paginación
router.get("/", isAuthenticated, async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1; // Página actual
    const limit = parseInt(req.query.limit) || 10; // Cantidad de elementos por página

    // Obtener los hechizos creados por el cliente
    const clientSpells = await Spell.find()
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("characters");

    // Obtener los hechizos de la API externa
    const authToken = req.headers.authorization.split(" ")[1]; // Obtener el token de autorización del encabezado
    const apiResponse = await axios.get(
      `https://www.dnd5eapi.co/api/spells?classes=wizard`, // Modifica esta URL según tus necesidades
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );
    const apiSpells = apiResponse.data.results;

    // Combinar los hechizos creados por el cliente y los de la API en un solo arreglo
    const allSpells = [...clientSpells, ...apiSpells];

    return res.status(200).json(allSpells);
  } catch (error) {
    next(error);
  }
});

// Obtener un hechizo por ID
router.get("/:id", isAuthenticated, async (req, res, next) => {
  try {
    const { id } = req.params;
    const spell = await Spell.findById(id).populate("characters");
    return res.status(200).json(spell);
  } catch (error) {
    next(error);
  }
});

// Crear un nuevo hechizo
router.post("/", isAuthenticated, async (req, res, next) => {
  try {
    const spell = await Spell.create(req.body);
    return res.status(201).json(spell);
  } catch (error) {
    next(error);
  }
});

// Actualizar un hechizo por ID
router.put("/:id", isAuthenticated, async (req, res, next) => {
  try {
    const { id } = req.params;
    const spell = await Spell.findByIdAndUpdate(id, req.body, { new: true });
    return res.status(200).json(spell);
  } catch (error) {
    next(error);
  }
});

// Eliminar un hechizo por ID
router.delete("/:id", isAuthenticated, async (req, res, next) => {
  try {
    const { id } = req.params;
    await Spell.findByIdAndDelete(id);
    // También elimina el hechizo del campo spellbook de los personajes relacionados
    await Character.updateMany(
      { "spellbook.spell": id },
      { $pull: { spellbook: { spell: id } } }
    );
    return res.status(200).json({ message: `Spell ${id} ha sido eliminado` });
  } catch (error) {
    next(error);
  }
});

module.exports = router;

// const router = require("express").Router();
// const Spell = require("../models/Spell.model");
// const Character = require("../models/Character.model");
// const axios = require("axios");
// const { isAuthenticated } = require("../middlewares/Token.middleware");
// // const { isAuthenticated } = require("../middlewares/Token.middleware");

// // Traer todos los hechizos con paginación
// router.get("/", isAuthenticated, async (req, res, next) => {
//   try {
//     const page = parseInt(req.query.page) || 1; // Página actual
//     const limit = parseInt(req.query.limit) || 10; // Cantidad de elementos por página

//     // Obtener los hechizos creados por el cliente
//     const clientSpells = await Spell.find()
//       .skip((page - 1) * limit)
//       .limit(limit)
//       .populate("characters");

//     // Obtener los hechizos de la API externa
//     const apiResponse = await axios.get(
//       `https://www.dnd5eapi.co/api/spells?classes=wizard` // Modifica esta URL según tus necesidades
//     );
//     const apiSpells = apiResponse.data.results;

//     // Combinar los hechizos creados por el cliente y los de la API en un solo arreglo
//     const allSpells = [...clientSpells, ...apiSpells];

//     return res.status(200).json(allSpells);
//   } catch (error) {
//     next(error);
//   }
// });

// // Obtener un hechizo por ID
// router.get("/:id", isAuthenticated, async (req, res, next) => {
//   try {
//     const { id } = req.params;
//     const spell = await Spell.findById(id).populate("characters");
//     return res.status(200).json(spell);
//   } catch (error) {
//     next(error);
//   }
// });

// // Crear un nuevo hechizo
// router.post("/", isAuthenticated, async (req, res, next) => {
//   try {
//     const spell = await Spell.create(req.body);
//     return res.status(201).json(spell);
//   } catch (error) {
//     next(error);
//   }
// });

// // Actualizar un hechizo por ID
// router.put("/:id", isAuthenticated, async (req, res, next) => {
//   try {
//     const { id } = req.params;
//     const spell = await Spell.findByIdAndUpdate(id, req.body, { new: true });
//     return res.status(200).json(spell);
//   } catch (error) {
//     next(error);
//   }
// });

// // Eliminar un hechizo por ID
// router.delete("/:id", isAuthenticated, async (req, res, next) => {
//   try {
//     const { id } = req.params;
//     await Spell.findByIdAndDelete(id);
//     // También elimina el hechizo del campo spellbook de los personajes relacionados
//     await Character.updateMany(
//       { "spellbook.spell": id },
//       { $pull: { spellbook: { spell: id } } }
//     );
//     return res.status(200).json({ message: `Spell ${id} ha sido eliminado` });
//   } catch (error) {
//     next(error);
//   }
// });

// module.exports = router;
