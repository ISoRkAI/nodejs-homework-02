const path = require('path');
const fs = require('fs').promises;
const Joi = require('joi');

const { randomBytes } = require('node:crypto');
const contactsPath = path.join(__dirname, '/contacts.json');

const listContacts = async () => {
  try {
    const contacts = await fs.readFile(contactsPath, 'utf-8');
    return JSON.parse(contacts);
  } catch (error) {
    return error;
  }
};

const getContactById = async contactId => {
  try {
    const contacts = await listContacts();

    const getContact = contacts.find(contacts => Number(contacts.id) === Number(contactId));
    return getContact;
  } catch (error) {
    return error;
  }
};

const removeContact = async contactId => {
  try {
    const contacts = await listContacts();
    const index = contacts.findIndex(({ id }) => {
      return id === contactId.toString();
    });
    if (index === -1) {
      console.log(index);
      return null;
    }
    const [removedContacts] = contacts.splice(index, 1);
    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
    return removedContacts;
  } catch (error) {}
};

const addContact = async body => {
  try {
    const { name, email, phone } = body;
    const schema = Joi.object({
      name: Joi.string().alphanum().min(3).max(30).required(),
      email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
        .required(),
      phone: Joi.string().min(1).max(30).required(),
    });
    const validationResult = schema.validate(body);
    if (validationResult.error) {
      return 'error';
    }
    const contacts = await listContacts();
    contacts.push({ id: randomBytes(10).toString('hex'), name: name, email: email, phone: phone });
    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
    return contacts;
  } catch (error) {
    return error;
  }
};

const updateContact = async (contactId, body) => {
  const { name, email, phone } = body;
  const schema = Joi.object({
    name: Joi.string().alphanum().min(3).max(30).required(),
    email: Joi.string()
      .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
      .required(),
    phone: Joi.string().min(1).max(30).required(),
  });
  const validationResult = schema.validate(body);
  if (validationResult.error) {
    return 'error';
  }
  const contacts = await listContacts();

  contacts.forEach(contact => {
    if (contact.id === contactId) {
      contact.name = name;
      contact.email = email;
      contact.phone = phone;
    }
  });
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
  return contacts;
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
