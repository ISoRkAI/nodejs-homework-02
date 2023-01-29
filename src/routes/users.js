const express = require('express');

const { authMiddleware } = require('../middlewares/authMiddleware');
const authUser = require('./api/authUser');
const router = express.Router();

router.post('/signup', async (req, res, next) => {
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

router.post('/login', async (req, res, next) => {
  try {
    const { token, user } = await authUser.login(req.body);
    const { email, subscription } = user;
    res.status(200).json({ token, user: { email, subscription } });
  } catch (error) {
    next(error);
  }
});

router.use(authMiddleware);

router.get('/current', async (req, res, next) => {
  try {
    const { email, subscription } = await authUser.current(req.user);
    res.status(200).json({ email, subscription });
  } catch (error) {
    next(error);
  }
});

router.get('/logout', async (req, res, next) => {
  try {
    const { _id } = req.user;
    const { email, subscription } = await authUser.logout(_id);
    res.status(200).json({ email, subscription });
  } catch (error) {
    next(error);
  }
});
module.exports = router;
