module.exports = (app) => {
  //Home and search routes
  const home = require("./search.routes");
  app.use("/", home);

  // Auth routes
  const authRouter = require("./auth.routes");
  app.use("/", authRouter);

  //USER
  const indexUser = require("./user.routes");
  app.use("/user", indexUser);

  //experiencias
  const experiences = require("./experiences.routes");
  app.use("/myExperiences", experiences);

  //search
  const search = require("./experiences.routes");
  app.use("/search", experiences);

};
