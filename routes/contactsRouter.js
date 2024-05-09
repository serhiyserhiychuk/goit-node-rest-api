import express from "express";
import {
  getAllContacts,
  getOneContact,
  deleteContact,
  createContact,
  updateContact,
  updateStatusContact,
} from "../controllers/contactsControllers.js";

import {
  createContactSchema,
  updateContactSchema,
} from "../schemas/contactsSchemas.js";

import validateBody from "../helpers/validateBody.js";
import tokenValidation from "../middlewares/tokenValidation.js";

const contactsRouter = express.Router();

contactsRouter.get("/", tokenValidation, getAllContacts);

contactsRouter.get("/:id", tokenValidation, getOneContact);

contactsRouter.delete("/:id", tokenValidation, deleteContact);

contactsRouter.post(
  "/",
  tokenValidation,
  validateBody(createContactSchema),
  createContact
);

contactsRouter.put(
  "/:id",
  tokenValidation,
  validateBody(updateContactSchema),
  updateContact
);

contactsRouter.patch(
  "/:contactId/favorite",
  tokenValidation,
  validateBody(updateContactSchema),
  updateStatusContact
);

export default contactsRouter;
