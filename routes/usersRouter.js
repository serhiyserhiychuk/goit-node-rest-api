import express from "express";
import { userSchema } from "../schemas/usersSchemas.js";
import validateBody from "../helpers/validateBody.js";
import tokenValidation from "../middlewares/tokenValidation.js";
import avatarUploader from "../middlewares/avatarUploader.js";
import {
  register,
  login,
  logout,
  getCurrentUser,
  subscriptionUpdate,
  avatarUpdate,
} from "../controllers/usersControllers.js";

const usersRouter = express.Router();

usersRouter.post("/register", validateBody(userSchema), register);
usersRouter.post("/login", validateBody(userSchema), login);
usersRouter.post("/logout", tokenValidation, logout);
usersRouter.get("/current", tokenValidation, getCurrentUser);
usersRouter.patch("/", tokenValidation, subscriptionUpdate);
usersRouter.patch(
  "/avatars",
  tokenValidation,
  avatarUploader.single("avatar"),
  avatarUpdate
);

export default usersRouter;
