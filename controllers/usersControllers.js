import bcrypt from "bcrypt";
import HttpError from "../helpers/HttpError.js";
import { getUserByEmail, createUser } from "../services/usersServices.js";
import { SECRET } from "../config.js";
import jwt from "jsonwebtoken";

export const register = async (req, res, next) => {
  try {
    const user = await getUserByEmail(req.body.email);

    if (user !== null) {
      throw HttpError(409, "Email in use");
    }

    const passwordHash = await bcrypt.hash(req.body.password, 10);

    const createdUser = await createUser({
      email: req.body.email,
      password: passwordHash,
    });

    res.status(201).send({
      user: {
        email: createdUser.email,
        subscription: createdUser.subscription,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const user = await getUserByEmail(req.body.email);

    if (!user) {
      throw HttpError(401, "Email or password is wrong");
    }

    const isMatch = await bcrypt.compare(req.body.password, user.password);

    if (!isMatch) {
      throw HttpError(401, "Email or password is wrong");
    }

    const payload = { id: user._id, email: user.email };
    const token = jwt.sign(payload, SECRET);

    user.token = token;

    res.status(200).send({
      token,
      user: {
        email: user.email,
        subscription: user.subscription,
      },
    });
  } catch (error) {
    next(error);
  }
};
