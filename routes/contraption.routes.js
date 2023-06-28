
const router = require("express").Router();
const Contraption = require("../models/Contraption.model");

// CRUD BACKEND

router.get("/", async (req, res, next) => {
  try {
    const contraptions = await Contraption.find();
    return res.status(200).json(contraptions);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const contraption = await Contraption.findById(id);
    return res.status(200).json(contraption);
  } catch (error) {
    next(error);
  }
});

// (C)RUD
router.post("/", async (req, res, next) => {
  try {
    console.log(req.body);
    if (!req.body)
      //.title
      return res.status(400).json({ message: "contraption creado" });
    const contraption = await Contraption.create(req.body);
    return res.status(201).json(contraption);
  } catch (error) {
    next(error);
  }
});

// CR(U)D
router.put("/:id", async (req, res, next) => {
  try {
    console.log("contrapcion editado");
    const { id } = req.params;
    const contraption = await Contraption.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    return res.status(200).json(contraption);
  } catch (error) {
    next(error);
  }
});

// CRU(D)
router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    await Contraption.findByIdAndDelete(id);
    return res
      .status(200)
      .json({ message: `contraption ${id} ha sido eliminado🗑` });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
