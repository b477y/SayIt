import authController from "./modules/auth/auth.controller.js";
import userController from "./modules/user/user.controller.js";
import connectDB from "./db/connection.js";

const bootstrap = (app, express) => {
  app.use(express.json());

  app.use("/auth", authController);
  app.use("/user", userController);

  app.all("*", (req, res, next) => {
    return next(new Error("In-valid routing", { cause: 404 }));
  });

  app.use((error, req, res, next) => {
    if (process.env.ENV === "development") {
      return res.status(error.cause).json({
        message: error.message,
        errorStack: error.stack,
      });
    }
    return res.status(error.cause).json({
      message: error.message,
    });
  });

  connectDB();
};

export default bootstrap;
