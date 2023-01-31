const jwt = require('jsonwebtoken');
const { User } = require('../models/userModel');
const { AuthorizationError, UnauthorizedError } = require('../helpers/errors');

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization || '';
  const [type, token] = authHeader.split(' ');

  if (!token || !type) {
    next(new AuthorizationError('Not authorized'));
  }
  try {
    const user = jwt.decode(token, process.env.JWT_SECRET);

    const userToken = await User.findById(user._id);
    if (!userToken.token) {
      throw new UnauthorizedError('Not authorized');
    }
    req.token = token;
    req.user = user;
    next();
  } catch (error) {
    next(new AuthorizationError('Not authorized'));
  }
};

module.exports = {
  authMiddleware,
};
