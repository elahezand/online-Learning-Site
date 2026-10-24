class AppError extends Error {
  constructor(statusCode, message, errors) {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
    this.errors = errors;
  }

  static badRequest(message, errors) {
    return new AppError(400, message, errors);
  }

  static unauthorized(message = "Please log in to continue") {
    return new AppError(401, message);
  }

  static forbidden(message = "You don't have access to this resource") {
    return new AppError(403, message);
  }

  static notFound(message = "Not found") {
    return new AppError(404, message);
  }

  static conflict(message) {
    return new AppError(409, message);
  }
}

module.exports = AppError;
