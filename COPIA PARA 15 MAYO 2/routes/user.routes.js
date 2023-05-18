const router = require("express").Router();
const User = require("../models/User.model");
const bcrypt = require("bcryptjs");
const saltRounds = 10;

const { isLoggedIn, checkRole } = require("../middlewares/route-guard");

router.get("/:id", isLoggedIn, async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    res.render("userDetails", {
      user,
      canEdit:
        req.session.currentUser &&
        (["ADMIN"].includes(req.session.currentUser.role) ||
          req.session.currentUser.email == user.email),
      canDelete:
        req.session.currentUser &&
        ["ADMIN"].includes(req.session.currentUser.role),
    });
  } catch (error) {
    next(error);
  }
});

router.get(
  "/:id/edit",
  // [isLoggedIn, checkRole(["ADMIN", "STUDENT"])],
  async (req, res, next) => {
    try {
      const user = await User.findById(req.params.id);
      if (
        user.email == req.session.currentUser.email ||
        req.session.currentUser.role == "ADMIN"
      ) {
        res.render("auth/form-edit", {
          user,
          canEdit:
            req.session.currentUser &&
            ["USER", "ADMIN"].includes(req.session.currentUser.role),
        });
      } else {
        res.render("auth/login", { errorMessage: "No tienes permisos." });
      }
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  "/:id/edit",
  [isLoggedIn, checkRole(["ADMIN", "USER"])],
  async (req, res, next) => {
    try {
      console.log("estoy actualizando");
      const user = req.body;
      if (user.userPwd) {
        console.log(req.session.currentUser);
        bcrypt
          .genSalt(saltRounds)
          .then((salt) => bcrypt.hash(user.userPwd, salt))
          .then(async (hashedPassword) => {
            await User.findByIdAndUpdate(req.params.id, {
              ...user,
              password: hashedPassword,
            });
            res.redirect("/}");
          });
      } else {
        console.log(req.session.currentUser);
        await User.findByIdAndUpdate(req.params.id, {
          ...req.body,
        });
        res.redirect("/");
      }
    } catch (e) {
      next(e);
    }
  }
);

//------AJUSTES//
// Mis ajustes
router.get("/:id/ajustes", isLoggedIn, async (req, res) => {
  try {
    const user = await User.findById(req.session.currentUser._id);
    res.render("auth/form-edit", { user: req.session.currentUser });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error de servidor");
  }
});

router.post("/:id/delete", isLoggedIn, async (req, res, next) => {
  const { deletedCount, acknowledged } = await User.findByIdAndDelete({
    _id: req.params.id,
  });

  if (deletedCount) {
    res.redirect("/");
  } else {
    res.status(500).render("Experience not found");
  }
});

module.exports = router;
