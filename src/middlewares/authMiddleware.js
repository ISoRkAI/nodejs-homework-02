const jwt = require('jsonwebtoken');
const { User } = require('../models/userModel');
const { MiddlewareUnauthorizedError, CurrentUserUnauthorizedError } = require('../helpers/errors');

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization || '';
  const [type, token] = authHeader.split(' ');

  if (!token || !type) {
    next(new MiddlewareUnauthorizedError('Not authorized'));
  }
  try {
    const user = jwt.decode(token, process.env.JWT_SECRET);

    const userToken = await User.findById(user._id);
    if (!userToken.token) {
      throw new CurrentUserUnauthorizedError('Not authorized');
    }
    req.token = token;
    req.user = user;
    next();
  } catch (error) {
    next(new MiddlewareUnauthorizedError('Not authorized'));
  }
};

module.exports = {
  authMiddleware,
};
