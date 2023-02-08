const {
  AuthorizationError,
  RegistrationConflictError,
  UnauthorizedError,
  NotFound,
} = require('../helpers/errors');

const errorHandler = (error, req, res, next) => {
  if (
    error instanceof AuthorizationError ||
    error instanceof RegistrationConflictError ||
    error instanceof UnauthorizedError ||
    error instanceof NotFound
  ) {
    console.log(res.status);
    return res.status(error.status).json({ message: error.message });
  }
  res.status(500).json({ message: error.message });
};

module.exports = {
  errorHandler,
};
