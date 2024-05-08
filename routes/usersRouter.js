import express from "express";
import { userSchema } from "../schemas/usersSchemas.js";
import validateBody from "../helpers/validateBody.js";
import { register, login } from "../controllers/usersControllers.js";

const usersRouter = express.Router();

usersRouter.post("/register", validateBody(userSchema), register);
usersRouter.post("/login", validateBody(userSchema), login);

export default usersRouter;
