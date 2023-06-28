const router = require("express").Router();
const Character = require("../models/Character.model");

// Obtener todos los personajes
router.get("/", async (req, res, next) => {
  try {
    const characters = await Character.find();
    return res.status(200).json(characters);
  } catch (error) {
    next(error);
  }
});

// Obtener un personaje por ID
router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const character = await Character.findById(id).populate("contraptions");
    return res.status(200).json(character);
  } catch (error) {
    next(error);
  }
});

// Crear un nuevo personaje
router.post("/", async (req, res, next) => {
  try {
    const character = await Character.create(req.body);
    return res.status(201).json(character);
  } catch (error) {
    next(error);
  }
});

// Actualizar un personaje por ID
router.put("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const character = await Character.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    return res.status(200).json(character);
  } catch (error) {
    next(error);
  }
});

// Eliminar un personaje por ID
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
