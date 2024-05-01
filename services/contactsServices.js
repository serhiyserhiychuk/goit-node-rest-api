import {
  getAllContacts,
  getOneContactById,
  createContact,
  updateContact,
  deleteContact,
} from "../service/index.js";

export async function listContacts() {
  const contacts = await getAllContacts();

  return contacts;
}

export async function getContactById(contactId) {
  const contactToFind = await getOneContactById(contactId);

  if (contactToFind === undefined) {
    return null;
  }

  return contactToFind;
}

export async function removeContact(contactId) {
  const contactToRemove = await deleteContact(contactId);
  if (contactToRemove !== undefined) {
    return contactToRemove;
  } else {
    return null;
  }
}

export async function addContact(name, email, phone) {
  const contactToAdd = await createContact({ name, email, phone });

  if (contactToAdd !== undefined) {
    return contactToAdd;
  } else {
    return null;
  }
}

export async function rewriteContact(contactToUpdate, { name, email, phone }) {
  const updatedContact = await updateContact(contactToUpdate.id, {
    name,
    email,
    phone,
  });
  return updatedContact;
}
