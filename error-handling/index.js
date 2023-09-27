module.exports = (app) => {
  app.use((req, res, next) => {
    res.status(404).json({ message: "la ruta no existe" });
  });

  app.use((err, req, res, next) => {


    if (!res.headersSent) {
      res.status(500).json({ message: "Error interno del servidor" });
    }
  });
};
