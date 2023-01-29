const { Contact } = require('../../models/postModel');

const listContacts = async owner => {
  const contacts = await Contact.find({ owner });
  return contacts;
};

const getContactById = async (contactId, owner) => {
  const contact = await Contact.findOne({ _id: contactId, owner });
  return contact;
};

const removeContact = async (contactId, owner) => {
  const removedContacts = Contact.findOneAndRemove({ _id: contactId, owner });
  return removedContacts;
};

const addContact = async (body, owner) => {
  const { name, email, phone, favorite } = body;
  const contact = new Contact({ name, email, phone, favorite, owner });
  return contact.save();
};

const updateContact = async (contactId, body, owner) => {
  const { name, email, phone } = body;
  const contact = await Contact.findOneAndUpdate(
    { _id: contactId, owner },
    {
      name,
      email,
      phone,
    }
  );
  return contact;
};

const updateStatusContact = async (contactId, body, owner) => {
  const { favorite } = body;
  const contact = await Contact.findOneAndUpdate(
    { _id: contactId, owner },
    {
      $set: { favorite },
    }
  );
  return contact;
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact,
};
