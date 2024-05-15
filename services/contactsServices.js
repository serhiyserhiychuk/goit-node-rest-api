import Contact from "../models/contact.js";

export const listContacts = async (ownerId) => {
  const contacts = await Contact.find({ owner: ownerId });
  return contacts;
};

export const getContact = (id, ownerId) => {
  return Contact.findOne({ _id: id, owner: ownerId });
};

export const addContact = ({ name, email, phone, owner }) => {
  return Contact.create({ name, email, phone, owner });
};

export const rewriteContact = (id, ownerId, fields) => {
  return Contact.findOneAndUpdate({ _id: id, owner: ownerId }, fields, {
    new: true,
  });
};

export const removeContact = (id, ownerId) => {
  return Contact.findOneAndDelete({ _id: id, owner: ownerId });
};
