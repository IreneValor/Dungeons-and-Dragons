const router = require("express").Router();
const { checkRole } = require("../middlewares/route-guard");
const Course = require("../models/Course.model");
const User = require("../models/User.model");

router.get("/", async (req, res, next) => {
  try {
    const courses = await Course.find();
    res.render("courses/courses", { courses });
  } catch (error) {
    res.render("error", { error });
  }
});

router.get("/create", checkRole("TA"), async (req, res, next) => {
  try {
    const dbUsers = await User.find();
    res.render("courses/create-course", { dbUsers });
  } catch (error) {
    res.render("error", { error });
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);
    res.render("courses/course-detail", {
      course,
      canDelete:
        req.session.currentUser &&
        ["TA"].includes(req.session.currentUser.role),
      canEdit:
        req.session.currentUser &&
        ["TA"].includes(req.session.currentUser.role),
    });
  } catch (error) {
    res.render("error", { error });
  }
});

router.get("/:id/edit", async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);
    const dbUsers = await User.find();
    res.render("courses/edit-course", { course, dbUsers });
  } catch (error) {
    res.render("error", { error });
  }
});

router.post("/create", checkRole("TA"), async (req, res, next) => {
  try {
    await Course.create(req.body);
    res.redirect("/");
  } catch (error) {
    res.render("error", { error });
  }
});

router.post("/:id/delete", checkRole("TA"), async (req, res, next) => {
  try {
    await Course.findByIdAndRemove(req.params.id);
    res.redirect("/");
  } catch (error) {
    res.render("error", { error });
  }
});

router.post("/:id/edit", checkRole("TA"), async (req, res, next) => {
  try {
    await Course.findByIdAndUpdate(req.params.id, req.body);
    res.redirect("/");
  } catch (error) {
    res.render("error", { error });
  }
});

module.exports = router;
