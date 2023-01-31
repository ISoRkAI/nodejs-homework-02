const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();

const { User } = require('../../models/userModel');
const { RegistrationConflictError, UnauthorizedError } = require('../../helpers/errors');

const signup = async ({ email, password }) => {
  const emailUsers = await User.findOne({ email });

  if (emailUsers !== null) {
    throw new RegistrationConflictError(`Email ${email} in use`);
  }

  const user = new User({ email, password });
  return await user.save();
};

const login = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new UnauthorizedError(`Email or password is wrong`);
  }
  const token = jwt.sign(
    {
      _id: user._id,
      email: user.email,
    },
    process.env.JWT_SECRET
  );
  await User.findByIdAndUpdate(user._id, { token });
  return { token, user };
};

const current = async ({ email }) => {
  const subscription = await User.find({ email });
  const user = new User({ email, subscription });
  return user;
};

const logout = async userId => {
  const userToken = await User.findByIdAndUpdate(userId, { token: null });
  return userToken;
};

module.exports = {
  signup,
  login,
  current,
  logout,
};
