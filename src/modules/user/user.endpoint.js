import { roleTypes } from "../../middlewares/auth.middleware.js";

export const endpoint = {
  profile: Object.values(roleTypes),
};
