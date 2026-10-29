const multer = require("multer");
const mongoose = require("mongoose");
const { ZodError } = require("zod");
const AppError = require("../utils/AppError");
const env = require("../config/env");
const { removeFile } = require("../utils/files");

const formatZodErrors = (error) =>
  error.issues.map((issue) => ({ field: issue.path.join("."), message: issue.message }));

const toResponse = (error) => {
  if (error instanceof AppError) {
    return { status: error.statusCode, body: { message: error.message, ...(error.errors && { errors: error.errors }) } };
  }
  if (error instanceof ZodError) {
    const errors = formatZodErrors(error);
    return { status: 400, body: { message: errors[0]?.message ?? "Validation failed", errors } };
  }
  if (error instanceof multer.MulterError) {
    const message = error.code === "LIMIT_FILE_SIZE" ? "The file is too large" : error.message;
    return { status: 400, body: { message } };
  }
  if (error instanceof mongoose.Error.CastError) {
    return { status: 400, body: { message: `Invalid value for ${error.path}` } };
  }
  if (error instanceof mongoose.Error.ValidationError) {
    const errors = Object.values(error.errors).map((item) => ({ field: item.path, message: item.message }));
    return { status: 400, body: { message: errors[0]?.message ?? "Validation failed", errors } };
  }
  if (error?.code === 11000) {
    const field = Object.keys(error.keyValue ?? {})[0] ?? "value";
    return { status: 409, body: { message: `This ${field} is already taken` } };
  }
  if (error?.type === "entity.parse.failed") {
    return { status: 400, body: { message: "The request body is not valid JSON" } };
  }
  return { status: 500, body: { message: "Something went wrong on the server" } };
};

const notFound = (req, res) => {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
};

const errorHandler = (error, req, res, next) => {
  const { status, body } = toResponse(error);
  if (status >= 500) console.error(error);
  if (req.file?.path) removeFile(req.file.path);
  if (!env.isProduction && status >= 500) body.detail = error.message;
  res.status(status).json(body);
};

module.exports = { errorHandler, notFound };
