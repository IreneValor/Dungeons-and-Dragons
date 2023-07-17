const router = require("express").Router();
const Spell = require("../models/Spell.model");
const Character = require("../models/Character.model");
const axios = require("axios");
const { isAuthenticated } = require("../middlewares/Token.middleware");

router.get("/", isAuthenticated, async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    console.log("page:", page); // Imprimir el valor de page en la consola
    console.log("limit:", limit); // Imprimir el valor de limit en la consola

    // Obtener los hechizos creados por el cliente
    const clientSpells = await Spell.find()
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("characters");

    // Obtener los hechizos de la API externa
    const authToken = req.headers.authorization.split(" ")[1]; // Obtener el token de autorización del encabezado
    const className = req.query.className || "wizard"; // Obtener el nombre de la clase desde los parámetros de la solicitud (por defecto: 'wizard')
    const apiResponse = await axios.get(
      `https://www.dnd5eapi.co/api/spells?classes=${className}`,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );
    const apiSpells = apiResponse.data.results;

    // Crear y guardar los hechizos de la API externa en MongoDB
    for (const apiSpell of apiSpells) {
      const existingSpell = await Spell.findOne({ name: apiSpell.name });
      if (!existingSpell) {
        const newSpell = new Spell({
          name: apiSpell.name,
          // ... Agrega otros campos necesarios según la estructura de tu modelo Spell
        });
        await newSpell.save();
      }
    }

    // Combinar los hechizos creados por el cliente y los de la API en un solo arreglo
    const allSpells = await Spell.find().populate("characters");

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
    console.log(req.body);
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
