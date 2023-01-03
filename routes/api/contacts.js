const express = require('express');
const contacts = require('../../models/contacts');
const router = express.Router();

router.get('/', async (req, res, next) => {
  const contactList = await contacts.listContacts();

  res.json(contactList);
});

router.get('/:contactId', async (req, res, next) => {
  const contacId = await contacts.getContactById(req.params.contactId);
  if (!contacId) {
    return res.status(404).json({ message: 'Not found' });
  }
  res.json({ contacId, status: 'succsess' });
});

router.post('/', async (req, res, next) => {
  res.json({ message: 'template message post' });
});

router.delete('/:contactId', async (req, res, next) => {
  res.json({ message: 'template message delete' });
});

router.put('/:contactId', async (req, res, next) => {
  res.json({ message: 'template message put' });
});

module.exports = router;
