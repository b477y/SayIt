const bootstrap = (app, express) => {
  app.use(express.json());

  app.all("*", (req, res, next) => {
    return res.status(404).json({ message: "In-valid routing" });
  });
};

export default bootstrap;
