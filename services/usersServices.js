import User from "../models/user.js";

export const getUserById = async (id) => {
  const contactToFind = await User.findById(id);
  return contactToFind;
};

export const getUserByEmail = async (email) => {
  const contactToFind = await User.findOne({ email });
  return contactToFind;
};

export const getUserByToken = async (verificationToken) => {
  const contactToFind = await User.findOne({ verificationToken });
  return contactToFind;
};

export const createUser = async ({ email, password, verificationToken }) => {
  const createdUser = await User.create({ email, password, verificationToken });
  return createdUser;
};

export const updateUser = async (id, fields) => {
  const updatedUser = await User.findByIdAndUpdate({ _id: id }, fields, {
    new: true,
  });
  return updatedUser;
};
