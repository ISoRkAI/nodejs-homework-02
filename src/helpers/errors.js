class AuthorizationError extends Error {
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
class UnauthorizedError extends Error {
  constructor(message) {
    super(message);
    this.status = 401;
  }
}

module.exports = {
  AuthorizationError,
  RegistrationConflictError,
  UnauthorizedError,
};
