import authController from "./modules/auth/auth.controller.js";
import userController from "./modules/user/user.controller.js";
import connectDB from "./db/connection.js";


const bootstrap = (app, express) => {
  app.use(express.json());

  app.use("/auth", authController);
  app.use("/user", userController);

  app.all("*", (req, res, next) => {
    return res.status(404).json({ message: "In-valid routing" });
  });

  connectDB();
};

export default bootstrap;
