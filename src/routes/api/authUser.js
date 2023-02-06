const jwt = require('jsonwebtoken');
const gravatar = require('gravatar');
const bcrypt = require('bcrypt');
require('dotenv').config();
const path = require('path');
const fs = require('fs/promises');
const Jimp = require('jimp');
const sha256 = require('sha256');
const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.API_TOKEN);

const { User } = require('../../models/userModel');
const {
  RegistrationConflictError,
  UnauthorizedError,
  NotFound,
  AuthorizationError,
} = require('../../helpers/errors');

const signup = async ({ email, password }) => {
  const emailUsers = await User.findOne({ email });
  const avatar = gravatar.url(email, { protocol: 'http' });
  if (emailUsers !== null) {
    throw new RegistrationConflictError(`Email ${email} in use`);
  }
  const code = sha256(email + process.env.JWT_SECRET);
  const user = new User({ email, password, avatarURL: avatar, verificationToken: code });

  const msg = {
    to: email,
    from: 'dimasoroka17@gmail.com',
    subject: 'Please, confirm your email',
    text: `Please, confirm your email address POST http://localhost:8088/api/users/verify/${code} `,
    html: `Please, confirm your email address POST http://localhost:8088/api/users/verify/${code} `,
  };
  await sgMail.send(msg);
  return await user.save();
};

const verificationUser = async verificationToken => {
  const user = await User.findOne({
    verificationToken,
    verify: false,
  });
  if (!user) {
    throw new NotFound(`User not found`);
  }
  user.verify = true;
  user.verificationToken = 'null';
  await user.save();

  const msg = {
    to: user.email,
    from: 'dimasoroka17@gmail.com',
    subject: 'Thank you for registration!',
    text: `Verification successful `,
    html: `Verification successful `,
  };
  await sgMail.send(msg);
};

const login = async ({ email, password }) => {
  const user = await User.findOne({ email });
  console.log(user.verify);
  if (user.verify === false) {
    throw new AuthorizationError(`Not authorized`);
  }
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
  const publicPath = path.resolve(__dirname, '../../../public/avatars', filename);

  const image = await Jimp.read(tmpPath);
  image.resize(250, 250);
  image.write(path.resolve(__dirname, '../../tmp', filename));

  await fs.rename(tmpPath, publicPath);
  await User.findByIdAndUpdate(userId, { avatarURL: publicPath });
  return publicPath;
};

const reVerification = async email => {
  const user = await User.findOne({ email });
  console.log(user);
  if (user === null) {
    throw new AuthorizationError(`missing required field email`);
  }
  if (user.verify === true) {
    throw new AuthorizationError(`Verification has already been passed`);
  }
  const code = sha256(email + process.env.JWT_SECRET);

  const msg = {
    to: email,
    from: 'dimasoroka17@gmail.com',
    subject: 'Please, confirm your email',
    text: `Please, confirm your email address POST http://localhost:8088/api/users/verify/${code} `,
    html: `Please, confirm your email address POST http://localhost:8088/api/users/verify/${code} `,
  };
  await sgMail.send(msg);
};

module.exports = {
  signup,
  login,
  current,
  logout,
  updateAvatar,
  verificationUser,
  reVerification,
};
