import Contact from "../models/contact.js";

export const listContacts = async () => {
  const contacts = await Contact.find();
  return contacts;
};

export const getContactById = (id) => {
  return Contact.findOne({ _id: id });
};

export const addContact = ({ name, email, phone }) => {
  return Contact.create({ name, email, phone });
};

export const rewriteContact = (id, fields) => {
  return Contact.findByIdAndUpdate({ _id: id }, fields, { new: true });
};

export const removeContact = (id) => {
  return Contact.findByIdAndRemove({ _id: id });
};
