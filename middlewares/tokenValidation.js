import jwt from "jsonwebtoken";
import { SECRET } from "../config.js";
import HttpError from "../helpers/HttpError.js";
import { getUserById } from "../services/usersServices.js";

const tokenValidation = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw HttpError(401, "Not authorized");
    }

    const [bearer, token] = authHeader.split(" ", 2);

    if (bearer !== "Bearer") {
      throw HttpError(401, "Not authorized");
    }

    jwt.verify(token, SECRET, async (error, decode) => {
      if (error) {
        throw HttpError(401, "Not authorized");
      }

      const user = await getUserById(decode.id);

      if (!user) {
        throw HttpError(401, "Not authorized");
      }

      console.log(user.token, token);

      if (user.token !== token) {
        throw HttpError(401, "Not authorized");
      }

      req.user = user;
      next();
    });
  } catch (error) {
    next(error);
  }
};

export default tokenValidation;
