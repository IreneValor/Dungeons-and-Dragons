const router = require("express").Router();
const Spell = require("../models/Spell.model");

// Obtener todos los hechizos
router.get("/", async (req, res, next) => {
  try {
    const spells = await Spell.find();
    return res.status(200).json(spells);
  } catch (error) {
    next(error);
  }
});

// Obtener un hechizo por ID
router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const spell = await Spell.findById(id);
    return res.status(200).json(spell);
  } catch (error) {
    next(error);
  }
});

// Crear un nuevo hechizo
router.post("/", async (req, res, next) => {
  try {
    const spell = await Spell.create(req.body);
    return res.status(201).json(spell);
  } catch (error) {
    next(error);
  }
});

// Actualizar un hechizo por ID
router.put("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const spell = await Spell.findByIdAndUpdate(id, req.body, { new: true });
    return res.status(200).json(spell);
  } catch (error) {
    next(error);
  }
});

// Eliminar un hechizo por ID
router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    await Spell.findByIdAndDelete(id);
    return res.status(200).json({ message: `Spell ${id} ha sido eliminado` });
  } catch (error) {
    next(error);
  }
});

module.exports = router;

// const router = require("express").Router();
// const axios = require("axios");
// const Spell = require("../models/Spell.model");

// // Obtener lista de hechizos por clase y nivel desde la API externa
// router.get("/:spellClass/:level", async (req, res, next) => {
//   try {
//     const { spellClass, level } = req.params;
//     const response = await axios.get("https://www.dnd5eapi.co/api/spells", {
//       params: {
//         class: spellClass,
//         level,
//       },
//     });
//     const spells = response.data.results;
//     return res.status(200).json(spells);
//   } catch (error) {
//     next(error);
//   }
// });

// // Obtener detalle de un hechizo por ID desde la API externa
// router.get("/detail/:id", async (req, res, next) => {
//   try {
//     const { id } = req.params;
//     const response = await axios.get(
//       `https://www.dnd5eapi.co/api/spells/${id}`
//     );
//     const spell = response.data;
//     return res.status(200).json(spell);
//   } catch (error) {
//     next(error);
//   }
// });

// // Crear un hechizo en MongoDB
// router.post("/", async (req, res, next) => {
//   try {
//     const { name, desc, level } = req.body;

//     const spell = new Spell({
//       name,
//       desc,
//       level,
//     });

//     const savedSpell = await spell.save();
//     return res.status(201).json(savedSpell);
//   } catch (error) {
//     next(error);
//   }
// });

// // Editar un hechizo por ID en MongoDB
// router.put("/:id", async (req, res, next) => {
//   try {
//     const { id } = req.params;
//     const { name, desc, level } = req.body;

//     const updatedSpell = await Spell.findByIdAndUpdate(
//       id,
//       { name, desc, level },
//       { new: true }
//     );

//     return res.status(200).json(updatedSpell);
//   } catch (error) {
//     next(error);
//   }
// });

// // Eliminar un hechizo por ID en MongoDB
// router.delete("/:id", async (req, res, next) => {
//   try {
//     const { id } = req.params;

//     await Spell.findByIdAndDelete(id);

//     return res.status(200).json({ message: `Spell ${id} ha sido eliminado` });
//   } catch (error) {
//     next(error);
//   }
// });

// module.exports = router;
