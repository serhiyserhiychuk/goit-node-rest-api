import {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  rewriteContact,
} from "../services/contactsServices.js";

import {
  createContactSchema,
  updateContactSchema,
} from "../schemas/contactsSchemas.js";
import HttpError from "../helpers/HttpError.js";
import validateBody from "../helpers/validateBody.js";

export const getAllContacts = (_, res) => {
  res.json(listContacts()).status(200);
};

export const getOneContact = (req, res) => {
  const { id } = req.params;
  const contactToFind = getContactById(id);
  if (contactToFind !== null) {
    res.json(contactToFind).status(200);
  } else {
    res.json(HttpError(404));
  }
};

export const deleteContact = (req, res) => {
  const { id } = req.params;
  const contactToDelete = removeContact(id);
  if (contactToDelete !== null) {
    res.json(contactToDelete).status(200);
  } else {
    res.json(HttpError(404));
  }
};

export const createContact = (req, res) => {
  const { name, email, phone } = req.body;

  validateBody(createContactSchema);

  const addedContact = addContact(name, email, phone);
  res.json(addedContact).status(201);
};

export const updateContact = (req, res) => {
  const { id } = req.params;
  const { name, email, phone } = req.body;

  if (!name && !email && !phone) {
    res.json({ message: "Body must have at least one field" }).status(400);
  }

  validateBody(updateContactSchema);

  const contactToUpdate = getContactById(id);

  if (contactToUpdate !== null) {
    const updatedContact = rewriteContact(contactToUpdate, {
      name,
      email,
      phone,
    });
    res.json(updatedContact).status(200);
  } else {
    res.json(HttpError(404));
  }
};
