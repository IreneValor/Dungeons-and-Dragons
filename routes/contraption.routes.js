const router = require("express").Router();
const Contraption = require("../models/Contraption.model");
const Character = require("../models/Character.model");
const axios = require("axios");
const { isAuthenticated } = require("../middlewares/Token.middleware");

router.get("/", isAuthenticated, async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage) || 10; 
    const startIndex = (page - 1) * perPage;

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

    const allContraptions = await Contraption.find()
      .skip(startIndex)
      .limit(perPage)
      .populate("characters");

    const totalContraptions = await Contraption.countDocuments();

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

    return res.status(200).json({
      contraptionsData,
      totalPages: Math.ceil(totalContraptions / perPage),
    });
  } catch (error) {
    next(error);
  }
});


router.get("/:id", isAuthenticated, async (req, res, next) => {
  try {
    const { id } = req.params;
    const token = req.headers.authorization.split(" ")[1];
    const contraption = await Contraption.findById(id).populate("characters");
    return res.status(200).json(contraption);
  } catch (error) {
    next(error);
  }
});

router.post("/", isAuthenticated, async (req, res, next) => {
  try {
    const contraption = await Contraption.create(req.body);
    return res.status(201).json(contraption);
  } catch (error) {
    next(error);
  }
});

router.put("/:id", isAuthenticated, async (req, res, next) => {
  try {
    const { id } = req.params;
    const token = req.headers.authorization.split(" ")[1];
    console.log("Received PUT request for Contraption with ID:", id);
    console.log("Request body:", req.body); 
    const contraption = await Contraption.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    console.log("Updated Contraption:", contraption); 
    return res.status(200).json(contraption);
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", isAuthenticated, async (req, res, next) => {
  try {
    const { id } = req.params;
    const token = req.headers.authorization.split(" ")[1];
    await Contraption.findByIdAndDelete(id);

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
