import jwt from "jsonwebtoken";
import userModel from "../db/model/User.model.js";
import { asyncHandler } from "../utils/error/error.handling.js";

export const roleTypes = {
  User: "User",
  Admin: "Admin",
  HR: "HR",
};

export const authentication = asyncHandler(async (req, res, next) => {
  const { authorization } = req.headers; // token

  if (!authorization) {
    return next(new Error("Authorization is required", { cause: 400 }));
  }

  const [Bearer, token] = authorization.split(" ");

  if (!Bearer || !token) {
    return next(new Error("Authorization is required", { cause: 400 }));
  }

  let TOKEN_SIGNATURE = undefined;

  switch (Bearer) {
    case "Admin":
      TOKEN_SIGNATURE = process.env.TOKEN_SIGNATURE_ADMIN;
      break;

    case "User":
      TOKEN_SIGNATURE = process.env.TOKEN_SIGNATURE_USER;
      break;

    default:
      break;
  }

  const decoded = jwt.verify(token, TOKEN_SIGNATURE); // token payload

  if (!decoded?.id) {
    return next(new Error("In-valid token payload", { cause: 400 })); // decoded object is not exist || it doesn't include the id
  }

  const user = await userModel.findById(decoded.id);

  if (!user) {
    return next(new Error("Not registered", { cause: 404 }));
  }
  req.user = user;
  return next();
});

export const authorization = (accessRoles = []) => {
  return asyncHandler(async (req, res, next) => {
    if (!req.user || !req.user.role) {
      return next(
        new Error("User information is missing or invalid", { cause: 401 })
      );
    }
    if (!accessRoles.includes(req.user.role)) {
      return next(new Error("Not authorized account", { cause: 403 }));
    }
    next();
  });
};
