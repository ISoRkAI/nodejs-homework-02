const {
  RegistrationValidationError,
  RegistrationConflictError,
  LoginAuthError,
  MiddlewareUnauthorizedError,
  LogoutUnauthorizedError,
  CurrentUserUnauthorizedError,
  LoginValidationError,
} = require('../helpers/errors');

const errorHandler = (error, req, res, next) => {
  if (
    error instanceof RegistrationValidationError ||
    error instanceof RegistrationConflictError ||
    error instanceof LoginAuthError ||
    error instanceof MiddlewareUnauthorizedError ||
    error instanceof LogoutUnauthorizedError ||
    error instanceof CurrentUserUnauthorizedError ||
    error instanceof LoginValidationError
  ) {
    console.log(res.status);
    return res.status(error.status).json({ message: error.message });
  }
};

module.exports = {
  errorHandler,
};
