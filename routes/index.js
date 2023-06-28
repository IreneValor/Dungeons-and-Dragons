const router = require("express").Router();

router.use("/contraptions", require("./contraption.routes"));
router.use("/auth", require("./auth.routes"));
router.use("/spells", require("./spell.routes"));
router.use("/characters", require("./character.routes")); //api/spells

module.exports = router;

// recuerda!!!! en la autenficacion del BACK , comprueba en postman solo los POST los GET obvio !! te dan error
