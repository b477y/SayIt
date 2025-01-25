import authController from "./modules/auth/auth.controller.js";
import userController from "./modules/user/user.controller.js";
import messageController from "./modules/message/message.controller.js";
import connectDB from "./db/connection.js";
import { globalErrorHandling } from "./utils/error/error.handling.js";

const bootstrap = (app, express) => {
  app.use(express.json());

  app.use("/auth", authController);
  app.use("/user", userController);
  app.use("/message", messageController);

  app.all("*", (req, res, next) => {
    return next(new Error("In-valid routing", { cause: 404 }));
  });

  app.use(globalErrorHandling);

  connectDB();
};

export default bootstrap;
