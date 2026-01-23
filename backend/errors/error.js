class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
  }
}

/* -------- FACTORY FUNCTIONS -------- */
class ValidationError extends AppError {
  constructor(message) {
    super(message, 400);
  }
}

class ConflictError extends AppError {
  constructor(message) {
    super(message, 409);
  }
}
class ForbiddenError extends AppError {
  constructor(message) {
    super(message, 403);
  }
}
class AuthError extends AppError {
  constructor(message) {
    super(message, 401);
  }
}

module.exports = {
  AppError,
  ValidationError,
  ConflictError,
  AuthError,
  ForbiddenError
};
