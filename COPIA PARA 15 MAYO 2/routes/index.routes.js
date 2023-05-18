const router = require("express").Router();

const User = require("../models/User.model");
const { isLoggedOut, isLoggedIn } = require("../middlewares/route-guard");

router.get("/", (req, res, next) => {
  res.render("index");
});

module.exports = router;
