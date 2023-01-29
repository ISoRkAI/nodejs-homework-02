const express = require('express');

const { schema } = require('../middlewares/validation');
const contacts = require('./api/contacts');
const { authMiddleware } = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(authMiddleware);

router.get('/', async (req, res, next) => {
  try {
    const { _id: owner } = req.user;
    const contactList = await contacts.listContacts(owner);

    res.status(200).json({ contactList });
  } catch (error) {
    next(error);
  }
});

router.get('/:contactId', async (req, res, next) => {
  try {
    const postId = req.params.contactId;
    const { _id: owner } = req.user;
    const contacId = await contacts.getContactById(postId, owner);

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
    const post = req.body;
    const validationResult = schema.validate(post);
    const { _id: owner } = req.user;

    if (validationResult.error) {
      return res.status(400).json({ message: 'missing required name field' });
    }

    const postContac = await contacts.addContact(post, owner);
    res.status(201).json({ postContac });
  } catch (error) {
    next(error);
  }
});

router.delete('/:contactId', async (req, res, next) => {
  try {
    const postId = req.params.contactId;
    const { _id: owner } = req.user;
    const contacId = await contacts.removeContact(postId, owner);
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
    const validationResult = schema.validate(req.body);

    if (validationResult.error) {
      return res.status(400).json({ message: 'missing fields' });
    }
    const post = req.body;
    const postId = req.params.contactId;
    const { _id: owner } = req.user;
    const changes = await contacts.updateContact(postId, post, owner);

    if (changes === null) {
      return res.status(404).json({ message: 'Not found' });
    }

    res.status(200).json({ changes, message: 'template message put' });
  } catch (error) {
    next(error);
  }
});

router.patch('/:contactId/favorite', async (req, res, next) => {
  try {
    const post = req.body;
    const contactId = req.params.contactId;
    const { _id: owner } = req.user;
    const patchContact = await contacts.updateStatusContact(contactId, post, owner);

    if (!patchContact) {
      return res.status(404).json({ message: 'missing field favorite' });
    }

    res.status(200).json({ patchContact });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
