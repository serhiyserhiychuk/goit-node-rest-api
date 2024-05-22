import bcrypt from "bcrypt";
import * as fs from "node:fs/promises";
import path from "node:path";
import HttpError from "../helpers/HttpError.js";
import {
  getUserById,
  getUserByEmail,
  getUserByToken,
  createUser,
  updateUser,
} from "../services/usersServices.js";
import { SECRET } from "../config.js";
import jwt from "jsonwebtoken";
import gravatar from "gravatar";
import Jimp from "jimp";
import { nanoid } from "nanoid";
import sgMail from "@sendgrid/mail";
import { SEND_GRID_API_KEY } from "../config.js";
sgMail.setApiKey(SEND_GRID_API_KEY);

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
      verificationToken: nanoid(),
    });

    const httpUrl = gravatar.url(createdUser.email, {
      protocol: "http",
      s: "100",
    });

    await updateUser(createdUser.id, { avatarURL: httpUrl });

    const link = `http://localhost:3000/api/users/verify/${createdUser.verificationToken}`;

    const message = {
      to: createdUser.email,
      from: "serhiy20071@gmail.com",
      subject: "Email Verification",
      html: `<h1>Click this <a href=${link}>link</a> to verify your email.</h1>`,
      text: `Follow this link to verify your email: ${link}`,
    };

    sgMail.send(message);

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

    if (!user.verify) {
      throw HttpError(401, "Email is not verified");
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

export const verify = async (req, res, next) => {
  try {
    const user = await getUserByToken(req.params.verificationToken);

    if (!user) throw HttpError(404);

    await updateUser(user._id, {
      verificationToken: null,
      verify: true,
    });

    res.status(200).json({
      message: "Verification successful",
    });
  } catch (error) {
    next(error);
  }
};

export const resend = async (req, res, next) => {
  try {
    const user = await getUserByEmail(req.body.email);

    if (!user) throw HttpError(404);

    if (user.verify)
      throw HttpError(400, "Verification has already been passed");

    const link = `http://localhost:3000/api/users/verify/${user.verificationToken}`;

    const message = {
      to: user.email,
      from: "serhiy20071@gmail.com",
      subject: "Email Verification",
      html: `<h1>Click this <a href=${link}>link</a> to verify your email.</h1>`,
      text: `Follow this link to verify your email: ${link}`,
    };

    sgMail.send(message).then(console.log("send"));

    res.status(200).json({
      message: "Verification email sent",
    });
  } catch (error) {
    next(error);
  }
};
