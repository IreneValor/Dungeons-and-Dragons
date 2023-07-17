const router = require("express").Router();
const Contraption = require("../models/Contraption.model");
const Character = require("../models/Character.model");
const axios = require("axios");
const { isAuthenticated } = require("../middlewares/Token.middleware");

// Traer artilugios con paginación
router.get("/", isAuthenticated, async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1; // Página actual
    const limit = parseInt(req.query.limit) || 10; // Cantidad de elementos por página

    console.log("page:", page); // Imprimir el valor de page en la consola
    console.log("limit:", limit); // Imprimir el valor de limit en la consola

    // Obtener los artilugios creados por el cliente
    const clientContraptions = await Contraption.find()
    .skip((page - 1) * limit)
    .limit(limit)
    .populate("characters");

    // Obtener los artilugios de la API externa
    const token = req.headers.authorization.split(" ")[1];
    // Obtener los artilugios de la API externa
    const apiResponse = await axios.get(
      "https://www.dnd5eapi.co/api/equipment",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const apiContraptions = apiResponse.data.results;

    // Crear y guardar los artilugios de la API externa en MongoDB
    for (const apiContraption of apiContraptions) {
      const existingContraption = await Contraption.findOne({
        name: apiContraptions.name,
      });
      if (!existingContraption) {
        const newContraption = new Contraption({
          name: apiContraption.name,
          // ... Agrega otros campos necesarios según la estructura de tu modelo Contraption
        });
        await newContraption.save();
      }
    }

    // Combinar los artilugios creados por el usuario y los de la API en un solo arreglo
    const allContraptions = [...clientContraptions, ...apiContraptions];

    return res.status(200).json(allContraptions);
  } catch (error) {
    next(error);
  }
});

// Obtener un artilugio por ID
router.get("/:id", isAuthenticated, async (req, res, next) => {
  try {
    const { id } = req.params;
    console.log("error contraption api");
    const token = req.headers.authorization.split(" ")[1];
    const contraption = await Contraption.findById(id).populate("characters");
    return res.status(200).json(contraption);
  } catch (error) {
    console.log("ERROR /:id -> ", error);
    next(error);
  }
});

// Crear un nuevo artilugio
// router.post("/", isAuthenticated, async (req, res, next) => {
//   try {

//     console.log("estoy es lo que amndo", req.body);
//     // const contraption = await Contraption.create(req.body);
//     const contraption = await Contraption.create(req.body);
//     return res.status(201).json(contraption);
//   } catch (error) {
//     next(error);
//   }
// });

// Actualizar un artilugio por ID
router.put("/:id", isAuthenticated, async (req, res, next) => {
  try {
    const { id } = req.params;
    const token = req.headers.authorization.split(" ")[1];
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
