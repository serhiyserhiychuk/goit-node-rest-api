import User from "../models/user.js";

export const getUserById = async (id) => {
  const contactToFind = await User.findById(id);
  return contactToFind;
};

export const getUserByFilter = async (filter) => {
  const contactToFind = await User.findOne(filter);
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
