const isLoggedIn = (req, res, next) => {
  if (req.session.currentUser) {
    next();
  } else {
    res.render("auth/login", { errorMessage: "Debes iniciar secion" });
  }
};

const checkRole =
  (roles = ["USER", "ADMIN"]) =>
  (req, res, next) => {
    console.log(req.session.currentUser);
    //   if (roles.includes(req.session.currentUser.role)) {
    next();
    // } else {
    //   res.render("auth/login", { user: req.session.currentUser });
    // }
  };

module.exports = { isLoggedIn, checkRole };
