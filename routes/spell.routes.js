// const router = require("express").Router();
// const Spell = require("../models/Spell.model");
// const Character = require("../models/Character.model");
// const axios = require("axios");
// const { isAuthenticated } = require("../middlewares/Token.middleware");

// // PAGINACION intento, solo devuelvo 10 y los botones no funcionan


// router.get("/", isAuthenticated, async (req, res, next) => {
//   try {
//     const authToken = req.headers.authorization.split(" ")[1];
//     const page = parseInt(req.query.page) || 1;
//     const perPage = parseInt(req.query.perPage) || 10;
//     const startIndex = (page - 1) * perPage;

//     // Sincronizar hechizos desde la API externa
//     await syncApiSpells(authToken);

//     const level = parseInt(req.query.level);

//     let query = {};

//     if (level) {
//       query.level = { $lte: level };
//     }

//     const allSpellsQuery = Spell.find(query);

//     if (page && perPage) {
//       allSpellsQuery.skip(startIndex).limit(perPage);
//     }

//     allSpellsQuery.populate("characters");

//     const allSpells = await allSpellsQuery.exec();

//     const totalSpells = await Spell.countDocuments(query);

//     const spellsData = allSpells.map((spell) => ({
//       _id: spell._id,
//       index: spell.index,
//       name: spell.name,
//       desc: spell.desc,
//       higher_level: spell.higher_level,
//       characters: spell.characters,
//       components: spell.components,
//       level: spell.level,
//       isFavorite: spell.isFavorite,
//       subclasses: spell.subclasses,
//     }));

//     return res.status(200).json({
//       spellsData,
//       totalPages: Math.ceil(totalSpells / perPage),
//     });
//   } catch (error) {
//     next(error);
//   }
// });

// // Nueva ruta para realizar la búsqueda por término
// router.get("/search", isAuthenticated, async (req, res, next) => {
//   try {
//     const { term } = req.query;
//     const spells = await Spell.find({
//       name: { $regex: new RegExp(term, "i") },
//     }).populate("characters");

//     return res.status(200).json(spells);
//   } catch (error) {
//     next(error);
//   }
// });

// router.get("/:id", isAuthenticated, async (req, res, next) => {
//   try {
//     const { id } = req.params;
//     const spell = await Spell.findById(id).populate("characters");
//     return res.status(200).json(spell);
//   } catch (error) {
//     next(error);
//   }
// });

// router.post("/", isAuthenticated, async (req, res, next) => {
//   try {
//     const spell = await Spell.create(req.body);
//     return res.status(201).json(spell);
//   } catch (error) {
//     next(error);
//   }
// });

// router.put("/:id", isAuthenticated, async (req, res, next) => {
//   try {
//     const { id } = req.params;
//     const spell = await Spell.findByIdAndUpdate(id, req.body, { new: true });
//     return res.status(200).json(spell);
//   } catch (error) {
//     next(error);
//   }
// });

// router.delete("/:id", isAuthenticated, async (req, res, next) => {
//   try {
//     const { id } = req.params;
//     const token = req.headers.authorization.split(" ")[1];
//     await Spell.findByIdAndDelete(id);

//     await Character.updateMany(
//       { "spellbook.spell": id },
//       { $pull: { spellbook: { spell: id } } }
//     );
//     return res.status(200).json({ message: `Spell ${id} ha sido eliminado` });
//   } catch (error) {
//     next(error);
//   }
// });

// module.exports = router;

const router = require("express").Router();
const Spell = require("../models/Spell.model");
const Character = require("../models/Character.model");
const axios = require("axios");
const { isAuthenticated } = require("../middlewares/Token.middleware");

 // SIN PAGINACION DEVUELVE TODOS LOS HECHIZOS
router.get("/", isAuthenticated, async (req, res, next) => {
  const authToken = req.headers.authorization.split(" ")[1];
  const apiSpellsListResponse = await axios.get(
    `https://www.dnd5eapi.co/api/spells`,
    {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    }
  );
  const apiSpells = apiSpellsListResponse.data.results;

  for (const apiSpell of apiSpells) {
    const spellInMongo = await Spell.find({ name: apiSpell.name });
    if (!spellInMongo || spellInMongo.length === 0) {
      let spell;
      try {
        await axios
          .get(`https://www.dnd5eapi.co/api/spells/${apiSpell.index}`, {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          })
          .then((response) => {
            spell = response.data;
          });
      } catch (error) {}

      {
        const newSpell = new Spell({
          name: spell.name,
          desc: spell.desc,
          higher_level: spell.higher_level,
          characters: null,
          components: spell.school_of_magic,
          level: spell.level,
          isFavorite: false,
          subclasses: spell.subclasses,
        });

        await newSpell.save();
      }
    }
  }

  try {
    const level = parseInt(req.query.level);

    let filteredSpells = [];

    if (level) {
      filteredSpells = await Spell.find({ level: { $lte: level } }).populate(
        "characters"
      );
    } else {
      filteredSpells = await Spell.find().populate("characters");
    }

    return res.status(200).json(filteredSpells);
  } catch (error) {
    next(error);
  }
});

// Nueva ruta para realizar la búsqueda por término
router.get("/search", isAuthenticated, async (req, res, next) => {
  try {
    const { term } = req.query;
    const spells = await Spell.find({
      name: { $regex: new RegExp(term, "i") },
    }).populate("characters");

    return res.status(200).json(spells);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", isAuthenticated, async (req, res, next) => {
  try {
    const { id } = req.params;
    const spell = await Spell.findById(id).populate("characters");
    return res.status(200).json(spell);
  } catch (error) {
    next(error);
  }
});

router.post("/", isAuthenticated, async (req, res, next) => {
  try {
    const spell = await Spell.create(req.body);
    return res.status(201).json(spell);
  } catch (error) {
    next(error);
  }
});

router.put("/:id", isAuthenticated, async (req, res, next) => {
  try {
    const { id } = req.params;
    const spell = await Spell.findByIdAndUpdate(id, req.body, { new: true });
    return res.status(200).json(spell);
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", isAuthenticated, async (req, res, next) => {
  try {
    const { id } = req.params;
    const token = req.headers.authorization.split(" ")[1];
    await Spell.findByIdAndDelete(id);

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
