import bcrypt from "bcrypt";
import HttpError from "../helpers/HttpError.js";
import {
  getUserById,
  getUserByEmail,
  createUser,
  updateUser,
} from "../services/usersServices.js";
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

    const token = jwt.sign({ id: user._id, email: user.email }, SECRET);

    await updateUser(user.id, { token });

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

export const logout = async (req, res, next) => {
  try {
    const user = await getUserById(req.user._id);

    if (!user) {
      throw HttpError(401, "Not authorized");
    }

    await updateUser(user._id, { token: null });
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};

export const getCurrentUser = async (req, res, next) => {
  try {
    const user = await getUserById(req.user._id);

    if (!user) {
      throw HttpError(401, "Not authorized");
    }
    res
      .status(200)
      .send({ email: user.email, subscription: user.subscription });
  } catch (error) {
    next(error);
  }
};
