const express = require('express');
const contacts = require('../../models/contacts');
const router = express.Router();

router.get('/', async (req, res, next) => {
  const contactList = await contacts.listContacts();

  res.status(200).json({ contactList });
});

router.get('/:contactId', async (req, res, next) => {
  const contacId = await contacts.getContactById(req.params.contactId);
  if (!contacId) {
    return res.status(404).json({ message: 'Not found' });
  }
  res.status(200).json({ contacId });
});

router.post('/', async (req, res, next) => {
  const postContac = await contacts.addContact(req.body);
  if (postContac === 'error') {
    return res.status(400).json({ message: 'missing required name field' });
  }

  res.status(201).json({ postContac });
});

router.delete('/:contactId', async (req, res, next) => {
  const contacId = await contacts.removeContact(req.params.contactId);
  if (!contacId) {
    return res.status(404).json({ message: 'Not found' });
  }
  res.status(200).json({ contacId, message: 'contact deleted' });
});

router.put('/:contactId', async (req, res, next) => {
  const contactId = req.params.contactId;
  const changes = await contacts.updateContact(contactId, req.body);
  if (!changes) {
    return res.status(400).json({ message: 'missing fields' });
  }
  res.status(200).json({ changes, message: 'template message put' });
});

module.exports = router;
