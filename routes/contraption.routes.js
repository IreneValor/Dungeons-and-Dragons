const router = require("express").Router();
const Contraption = require("../models/Contraption.model");
const Character = require("../models/Character.model");

// Obtener todos los artilugios
router.get("/", async (req, res, next) => {
  try {
    const contraptions = await Contraption.find().populate("characters");
    return res.status(200).json(contraptions);
  } catch (error) {
    next(error);
  }
});

// Obtener un artilugio por ID
router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const contraption = await Contraption.findById(id).populate("characters");
    return res.status(200).json(contraption);
  } catch (error) {
    next(error);
  }
});

// Crear un nuevo artilugio
router.post("/", async (req, res, next) => {
  try {
    const contraption = await Contraption.create(req.body);
    return res.status(201).json(contraption);
  } catch (error) {
    next(error);
  }
});

// Actualizar un artilugio por ID
router.put("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const contraption = await Contraption.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    return res.status(200).json(contraption);
  } catch (error) {
    next(error);
  }
});

// Eliminar un artilugio por ID
router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
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

// const router = require("express").Router();
// const Contraption = require("../models/Contraption.model");

// // CRUD BACKEND

// router.get("/", async (req, res, next) => {
//   try {
//     const contraptions = await Contraption.find();
//     return res.status(200).json(contraptions);
//   } catch (error) {
//     next(error);
//   }
// });

// router.get("/:id", async (req, res, next) => {
//   try {
//     const { id } = req.params;
//     const contraption = await Contraption.findById(id);
//     return res.status(200).json(contraption);
//   } catch (error) {
//     next(error);
//   }
// });

// // (C)RUD
// router.post("/", async (req, res, next) => {
//   try {
//     console.log(req.body);
//     if (!req.body)
//       //.title
//       return res.status(400).json({ message: "contraption creado" });
//     const contraption = await Contraption.create(req.body);
//     return res.status(201).json(contraption);
//   } catch (error) {
//     next(error);
//   }
// });

// // CR(U)D
// router.put("/:id", async (req, res, next) => {
//   try {
//     console.log("contrapcion editado");
//     const { id } = req.params;
//     const contraption = await Contraption.findByIdAndUpdate(id, req.body, {
//       new: true,
//     });
//     return res.status(200).json(contraption);
//   } catch (error) {
//     next(error);
//   }
// });

// // CRU(D)
// router.delete("/:id", async (req, res, next) => {
//   try {
//     const { id } = req.params;
//     await Contraption.findByIdAndDelete(id);
//     return res
//       .status(200)
//       .json({ message: `contraption ${id} ha sido eliminado🗑` });
//   } catch (error) {
//     next(error);
//   }
// });

// module.exports = router;
