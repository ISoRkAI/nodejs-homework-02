const jwt = require('jsonwebtoken');
const gravatar = require('gravatar');
const bcrypt = require('bcrypt');
const path = require('path');
const fs = require('fs/promises');
const Jimp = require('jimp');

require('dotenv').config();

const { User } = require('../../models/userModel');
const { RegistrationConflictError, UnauthorizedError } = require('../../helpers/errors');

const signup = async ({ email, password }) => {
  const emailUsers = await User.findOne({ email });
  const avatar = gravatar.url(email, { protocol: 'http' });
  if (emailUsers !== null) {
    throw new RegistrationConflictError(`Email ${email} in use`);
  }

  const user = new User({ email, password, avatarURL: avatar });
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

const updateAvatar = async (file, userId) => {
  const { filename } = file;

  const tmpPath = path.resolve(__dirname, '../../tmp', filename);
  const publicPath = path.resolve(__dirname, '../../public/avatars', filename);

  const image = await Jimp.read(tmpPath);
  image.resize(250, 250);
  image.write(path.resolve(__dirname, '../../tmp', filename));

  await fs.rename(tmpPath, publicPath);

  await User.findByIdAndUpdate(userId, { avatarURL: publicPath });
  return publicPath;
};

module.exports = {
  signup,
  login,
  current,
  logout,
  updateAvatar,
};
