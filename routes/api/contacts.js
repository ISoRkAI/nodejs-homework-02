const express = require('express');
const contacts = require('../../models/contacts');
const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const contactList = await contacts.listContacts();
    console.log(contactList);
    res.status(200).json({ contactList });
  } catch (error) {
    next(error);
  }
});

router.get('/:contactId', async (req, res, next) => {
  try {
    const contacId = await contacts.getContactById(req.params.contactId);
    if (!contacId) {
      return res.status(404).json({ message: 'Not found' });
    }
    res.status(200).json({ contacId });
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const postContac = await contacts.addContact(req.body);
    console.log(postContac);

    if (postContac === 'error') {
      return res.status(400).json({ message: 'missing required name field' });
    }

    res.status(201).json({ postContac });
  } catch (error) {
    next(error);
  }
});

router.delete('/:contactId', async (req, res, next) => {
  try {
    const contacId = await contacts.removeContact(req.params.contactId);
    if (!contacId) {
      return res.status(404).json({ message: 'Not found' });
    }
    res.status(200).json({ contacId, message: 'contact deleted' });
  } catch (error) {
    next(error);
  }
});

router.put('/:contactId', async (req, res, next) => {
  try {
    const contactId = req.params.contactId;
    const changes = await contacts.updateContact(contactId, req.body);
    if (!changes) {
      return res.status(400).json({ message: 'missing fields' });
    }
    res.status(200).json({ changes, message: 'template message put' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
