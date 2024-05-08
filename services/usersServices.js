import User from "../models/user.js";

export const getUserByEmail = async (email) => {
  const contactToFind = await User.findOne({ email });
  return contactToFind;
};

export const createUser = async ({ email, password }) => {
  const createdUser = await User.create({ email, password });
  return createdUser;
};
