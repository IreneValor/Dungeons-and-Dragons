const router = require("express").Router();
const Character = require("../models/Character.model");
const Contraption = require("../models/Contraption.model");
const Spell = require("../models/Spell.model");

// TRAER TODOS LOS PERSONAJES
router.get("/", async (req, res, next) => {
  try {
    const characters = await Character.find();
    return res.status(200).json(characters);
  } catch (error) {
    next(error);
  }
});

// TRAER PERSONAJE POR ID
router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const character = await Character.findById(id)
      .populate("user")
      .populate("spells")
      .populate("contraptions")
      .exec();
    return res.status(200).json(character);
  } catch (error) {
    next(error);
  }
});

// CREAR NUEVO PERSONAJE(CON USER)
router.post("/", async (req, res, next) => {
  try {
    const { name, userId } = req.body;
    const character = new Character({ name, user: userId });
    await character.save();
    return res.status(201).json(character);
  } catch (error) {
    next(error);
  }
});

// ACTUALIZAR PERSONAJE(C Y S) CON ID
router.put("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, contraptions, spells } = req.body;

    // Actualizar el character
    const character = await Character.findByIdAndUpdate(
      id,
      { name },
      { new: true }
    );

    // Actualizar las contraptions relacionadas
    const updatedContraptions = await Contraption.updateMany(
      { _id: { $in: contraptions } },
      { $set: { character: id } }
    );

    // Actualizar los spells relacionados
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
    next(error);
  }
});
//----------------------

// ELIMINAR EL PERSONAJE
router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    await Character.findByIdAndDelete(id);
    return res
      .status(200)
      .json({ message: `Personaje ${id} ha sido eliminado` });
  } catch (error) {
    next(error);
  }
});

module.exports = router;

//------
// CODIGO ANTIGUO
//DETALLE PERSONAJE
// router.get("/:id", async (req, res, next) => {
//   try {
//     const { id } = req.params;
//     const character = await Character.findById(id).populate("contraptions");
//     return res.status(200).json(character);
//   } catch (error) {
//     next(error);
//   }
// });

//CREAR PERSONAJE
// router.post("/", async (req, res, next) => {
//   try {
//     const character = await Character.create(req.body);
//     return res.status(201).json(character);
//   } catch (error) {
//     next(error);
//   }
// });
//ACTUALIZAR PERSONAJE
// router.put("/:id", async (req, res, next) => {
//   try {
//     const { id } = req.params;
//     const character = await Character.findByIdAndUpdate(id, req.body, {
//       new: true,
//     });
//     return res.status(200).json(character);
//   } catch (error) {
//     next(error);
//   }
// });
