import {
  listContacts,
  getContact,
  rewriteContact,
  addContact,
  removeContact,
} from "../services/contactsServices.js";

import HttpError from "../helpers/HttpError.js";

export const getAllContacts = async (req, res, next) => {
  try {
    const contacts = await listContacts(req.user._id);
    res.json(contacts).status(200);
  } catch (error) {
    next(error);
  }
};

export const getOneContact = async (req, res, next) => {
  try {
    const { id } = req.params;

    const contactToFind = await getContact(id, req.user._id);

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

    const contactToDelete = await removeContact(id, req.user._id);

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
      req.body.phone,
      req.user._id
    );
    res.json(addedContact).status(201);
  } catch (error) {
    next(error);
  }
};

export const updateContact = async (req, res, next) => {
  try {
    const { id } = req.params;

    const updatedContact = await rewriteContact(id, req.user._id, {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
    });

    if (!updatedContact) {
      throw HttpError(404);
    }

    res.json(updatedContact).status(200);
  } catch (error) {
    next(error);
  }
};

export const updateStatusContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;

    const updatedContact = await rewriteContact(contactId, req.user._id, {
      favorite: req.body.favorite,
    });

    if (!updatedContact) {
      throw HttpError(404);
    }

    res.json(updatedContact).status(200);
  } catch (error) {
    next(error);
  }
};
