import {
  listContacts,
  getContactById,
  rewriteContact,
  addContact,
  removeContact,
} from "../routes/services/contactsServices.js";

import HttpError from "../helpers/HttpError.js";

export const getAllContacts = async (_, res, next) => {
  try {
    const contacts = await listContacts();
    res.json(contacts).status(200);
  } catch (error) {
    next(error);
  }
};

export const getOneContact = async (req, res, next) => {
  try {
    const { id } = req.params;

    const contactToFind = await getContactById(id);

    if (!contactToFind) {
      throw HttpError(404);
    }

    res.json(contactToFind).status(200);
  } catch (error) {
    next(error);
  }
};

export const deleteContact = async (req, res, next) => {
  try {
    const { id } = req.params;

    const contactToDelete = await removeContact(id);

    if (!contactToDelete) {
      throw HttpError(404);
    }

    res.json(contactToDelete).status(200);
  } catch (error) {
    next(error);
  }
};

export const createContact = async (req, res, next) => {
  try {
    const addedContact = await addContact(
      req.body.name,
      req.body.email,
      req.body.phone
    );
    res.json(addedContact).status(201);
  } catch (error) {
    next(error);
  }
};

export const updateContact = async (req, res, next) => {
  try {
    const { id } = req.params;

    const contactToUpdate = await getContactById(id);

    if (!contactToUpdate) {
      throw HttpError(404);
    }

    const updatedContact = await rewriteContact(contactToUpdate, {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
    });
    res.json(updatedContact).status(200);
  } catch (error) {
    next(error);
  }
};

export const updateStatusContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;

    const contactToUpdate = await getContactById(contactId);

    if (!contactToUpdate) {
      throw HttpError(404);
    }

    const updatedContact = await rewriteContact(contactToUpdate, {
      favorite: req.body.favorite,
    });
    res.json(updatedContact).status(200);
  } catch (error) {
    next(error);
  }
};
