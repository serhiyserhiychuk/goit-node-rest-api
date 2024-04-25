import {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  rewriteContact,
} from "../services/contactsServices.js";

import HttpError from "../helpers/HttpError.js";

export const getAllContacts = async (_, res) => {
  const contacts = await listContacts();
  res.json(contacts).status(200);
};

export const getOneContact = async (req, res) => {
  const { id } = req.params;
  const contactToFind = await getContactById(id);
  if (contactToFind !== null) {
    res.json(contactToFind).status(200);
  } else {
    res.json(HttpError(404));
  }
};

export const deleteContact = async (req, res) => {
  const { id } = req.params;
  const contactToDelete = await removeContact(id);
  if (contactToDelete !== null) {
    res.json(contactToDelete).status(200);
  } else {
    res.json(HttpError(404));
  }
};

export const createContact = async (req, res) => {
  const { name, email, phone } = req.body;

  const addedContact = await addContact(name, email, phone);
  res.json(addedContact).status(201);
};

export const updateContact = async (req, res) => {
  const { id } = req.params;
  const { name, email, phone } = req.body;

  if (!name && !email && !phone) {
    res.json({ message: "Body must have at least one field" }).status(400);
  }

  const contactToUpdate = await getContactById(id);

  if (contactToUpdate !== null) {
    const updatedContact = await rewriteContact(contactToUpdate, {
      name,
      email,
      phone,
    });
    res.json(updatedContact).status(200);
  } else {
    res.json(HttpError(404));
  }
};
