const router = require("express").Router();

router.use("/contraptions", require("./contraption.routes"));
router.use("/auth", require("./auth.routes"));
router.use("/spells", require("./spell.routes"));
router.use("/characters", require("./character.routes"));

module.exports = router;