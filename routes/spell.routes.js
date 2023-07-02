const router = require("express").Router();
const Spell = require("../models/Spell.model");
const Character = require("../models/Character.model");

// Traer todos los hechizos con  paginacion
router.get("/", async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1; // Página actual
    const limit = parseInt(req.query.limit) || 10; // Cantidad de elementos por página

    const spells = await Spell.find()
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("characters");

    return res.status(200).json(spells);
  } catch (error) {
    next(error);
  }
});

// Obtener un hechizo por ID
router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const spell = await Spell.findById(id).populate("characters");
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



