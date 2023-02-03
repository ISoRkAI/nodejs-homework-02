const express = require('express');
const router = express.Router();

const { authMiddleware } = require('../middlewares/authMiddleware');
const { upload } = require('../middlewares/avatarMiddleware');
const { userValidation } = require('../middlewares/validation');
const authUser = require('./api/authUser');

router.post('/signup', userValidation, async (req, res, next) => {
  try {
    const signupUser = await authUser.signup(req.body);
    const { email, subscription } = signupUser;
    res.status(201).json({
      signupUser: { email, subscription },
    });
  } catch (error) {
    next(error);
  }
});

router.post('/login', userValidation, async (req, res, next) => {
  try {
    const { token, user } = await authUser.login(req.body);
    const { email, subscription } = user;
    res.status(200).json({ token, user: { email, subscription } });
  } catch (error) {
    next(error);
  }
});

router.get('/current', authMiddleware, async (req, res, next) => {
  try {
    const { email, subscription } = await authUser.current(req.user);
    res.status(200).json({ email, subscription });
  } catch (error) {
    next(error);
  }
});

router.get('/logout', authMiddleware, async (req, res, next) => {
  try {
    const { _id } = req.user;
    const { email, subscription } = await authUser.logout(_id);
    res.status(200).json({ email, subscription });
  } catch (error) {
    next(error);
  }
});

router.patch('/avatars', authMiddleware, upload.single('avatar'), async (req, res, next) => {
  try {
    const { _id } = req.user;
    const avatarAddress = await authUser.updateAvatar(req.file, _id);
    res.status(200).json({ avatarURL: avatarAddress });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
