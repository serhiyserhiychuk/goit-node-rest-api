import express from "express";
import { userSchema, resendUserSchema } from "../schemas/usersSchemas.js";
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
  verify,
  resend,
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
usersRouter.get("/verify/:verificationToken", verify);
usersRouter.post("/verify", validateBody(resendUserSchema), resend);

export default usersRouter;
