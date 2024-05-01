import Contact from "./schemas/contact.js";

export const getAllContacts = async () => {
  const contacts = await Contact.find();
  return contacts;
};

export const getOneContactById = (id) => {
  return Contact.findOne({ _id: id });
};

export const createContact = ({ name, email, phone }) => {
  return Contact.create({ name, email, phone });
};

export const updateContact = (id, fields) => {
  return Contact.findByIdAndUpdate({ _id: id }, fields, { new: true });
};

export const deleteContact = (id) => {
  return Contact.findByIdAndRemove({ _id: id });
};
