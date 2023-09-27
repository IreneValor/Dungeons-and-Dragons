const router = require("express").Router();
const Spell = require("../models/Spell.model");
const Character = require("../models/Character.model");
const axios = require("axios");
const { isAuthenticated } = require("../middlewares/Token.middleware");

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
