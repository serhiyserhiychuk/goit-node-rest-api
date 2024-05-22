import bcrypt from "bcrypt";
import * as fs from "node:fs/promises";
import path from "node:path";
import HttpError from "../helpers/HttpError.js";
import {
  getUserById,
  getUserByEmail,
  createUser,
  updateUser,
} from "../services/usersServices.js";
import { SECRET } from "../config.js";
import jwt from "jsonwebtoken";
import gravatar from "gravatar";
import Jimp from "jimp";

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

    const httpUrl = gravatar.url(createdUser.email, {
      protocol: "http",
      s: "100",
    });

    await updateUser(createdUser.id, { avatarURL: httpUrl });

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
    await updateUser(req.user._id, { token: null });
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};

export const getCurrentUser = async (req, res, next) => {
  try {
    const user = await getUserById(req.user._id);

    res
      .status(200)
      .json({ email: user.email, subscription: user.subscription });
  } catch (error) {
    next(error);
  }
};

export const subscriptionUpdate = async (req, res, next) => {
  try {
    const updatedUser = await updateUser(req.user._id, {
      subscription: req.body.subscription,
    });

    res.status(200).send({
      email: updatedUser.email,
      subscription: updatedUser.subscription,
    });
  } catch (error) {
    next(error);
  }
};

export const avatarUpdate = async (req, res, next) => {
  try {
    const picture = await Jimp.read(req.file.path);
    picture.resize(250, 250).write(path.resolve(req.file.path));

    await fs.rename(
      req.file.path,
      path.resolve("public/avatars", req.file.filename)
    );

    const user = await updateUser(req.user.id, {
      avatarURL: req.file.filename,
    });

    res.send({
      avatarURL: user.avatarURL,
    });
  } catch (error) {
    next(error);
  }
};
