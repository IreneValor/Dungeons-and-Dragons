const router = require("express").Router();
const Contraption = require("../models/Contraption.model");
const Character = require("../models/Character.model");
const axios = require("axios");
const { isAuthenticated } = require("../middlewares/Token.middleware");

// Traer artilugios con paginación
router.get("/", isAuthenticated, async (req, res, next) => {
  try {
    const clientContraptions = await Contraption.find().populate("characters");

    const syncApiContraptions = async () => {
      const token = req.headers.authorization.split(" ")[1];
      const apiResponse = await axios.get(
        "https://www.dnd5eapi.co/api/equipment",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const apiContraptions = apiResponse.data.results;

      for (const apiContraption of apiContraptions) {
        const existingContraption = await Contraption.findOne({
          name: apiContraption.name,
        });
        if (!existingContraption) {
          const { data } = await axios.get(
            `https://www.dnd5eapi.co${apiContraption.url}`
          );
          const newContraption = new Contraption({
            name: apiContraption.name,
            ...data,
          });

          await newContraption.save();
        }
      }
    };

    await syncApiContraptions();

    const allContraptions = await Contraption.find();

    const contraptionsData = allContraptions.map((contraption) => ({
      _id: contraption._id,
      index: contraption.index,
      name: contraption.name,
      category_range: contraption.category_range,
      contents: contraption.contents,
      cost: contraption.cost,
      damage: contraption.damage,
      description: contraption.description,
      equipment_category: contraption.equipment_category,
      properties: contraption.properties,
      range: contraption.range,
      special: contraption.special,
      url: contraption.url,
      weapon_category: contraption.weapon_category,
      weapon_range: contraption.weapon_range,
      weight: contraption.weight,
    }));

    return res.status(200).json(contraptionsData);
  } catch (error) {
    next(error);
  }
});

// Obtener un artilugio por ID
router.get("/:id", isAuthenticated, async (req, res, next) => {
  try {
    const { id } = req.params;
    const token = req.headers.authorization.split(" ")[1];
    const contraption = await Contraption.findById(id).populate("characters");
    console.log(contraption);
    return res.status(200).json(contraption);
  } catch (error) {
    console.log("ERROR /:id -> ", error);
    next(error);
  }
});

// Crear un nuevo artilugio
router.post("/", isAuthenticated, async (req, res, next) => {
  try {
    console.log("estoy es lo que mando", req.body);
    // const contraption = await Contraption.create(req.body);
    const contraption = await Contraption.create(req.body);
    return res.status(201).json(contraption);
  } catch (error) {
    next(error);
  }
});

// Actualizar un artilugio por ID
router.put("/:id", isAuthenticated, async (req, res, next) => {
  try {
    const { id } = req.params;
    const token = req.headers.authorization.split(" ")[1];
    console.log(req.body);
    const contraption = await Contraption.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    return res.status(200).json(contraption);
  } catch (error) {
    next(error);
  }
});

// Eliminar un artilugio por ID
router.delete("/:id", isAuthenticated, async (req, res, next) => {
  try {
    const { id } = req.params;
    const token = req.headers.authorization.split(" ")[1];
    await Contraption.findByIdAndDelete(id);
    // También elimina el artilugio del campo contraptions de los personajes relacionados
    await Character.updateMany(
      { contraptions: id },
      { $pull: { contraptions: id } }
    );
    return res
      .status(200)
      .json({ message: `Contraption ${id} ha sido eliminado` });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
