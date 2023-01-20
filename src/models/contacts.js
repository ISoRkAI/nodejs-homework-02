const { Contact } = require('./postModel');

const listContacts = async () => {
  try {
    const contacts = await Contact.find({});
    return contacts;
  } catch (error) {
    return error;
  }
};

const getContactById = async contactId => {
  try {
    const contact = await Contact.findById(contactId);
    return contact;
  } catch (error) {
    return error;
  }
};

const removeContact = async contactId => {
  try {
    const removedContacts = Contact.findByIdAndRemove(contactId);
    return removedContacts;
  } catch (error) {
    return error;
  }
};

const addContact = async body => {
  try {
    const { name, email, phone, favorite } = body;
    const contact = new Contact({ name, email, phone, favorite });
    return contact.save();
  } catch (error) {
    return error;
  }
};

const updateContact = async (contactId, body) => {
  try {
    const { name, email, phone } = body;
    const contact = await Contact.findByIdAndUpdate(contactId, {
      $set: { name, email, phone },
    });
    return contact;
  } catch (error) {
    return error;
  }
};

const updateStatusContact = async (contactId, body) => {
  try {
    const { favorite } = body;
    const contact = await Contact.findByIdAndUpdate(contactId, {
      $set: { favorite },
    });
    return contact;
  } catch (error) {
    return error;
  }
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact,
};
