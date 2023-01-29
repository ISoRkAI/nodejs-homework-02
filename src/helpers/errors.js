class RegistrationValidationError extends Error {
  constructor(message) {
    super(message);
    this.status = 400;
  }
}
class LoginValidationError extends Error {
  constructor(message) {
    super(message);
    this.status = 400;
  }
}
class RegistrationConflictError extends Error {
  constructor(message) {
    super(message);
    this.status = 409;
  }
}
class LoginAuthError extends Error {
  constructor(message) {
    super(message);
    this.status = 401;
  }
}
class MiddlewareUnauthorizedError extends Error {
  constructor(message) {
    super(message);
    this.status = 400;
  }
}
class LogoutUnauthorizedError extends Error {
  constructor(message) {
    super(message);
    this.status = 401;
  }
}
class CurrentUserUnauthorizedError extends Error {
  constructor(message) {
    super(message);
    this.status = 401;
  }
}

module.exports = {
  RegistrationValidationError, // ✅
  RegistrationConflictError, // ✅
  LoginAuthError, // ✅
  MiddlewareUnauthorizedError,
  LogoutUnauthorizedError,
  CurrentUserUnauthorizedError,
  LoginValidationError, // ✅
};
