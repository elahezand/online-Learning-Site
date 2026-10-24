const jwt = require("jsonwebtoken");
const User = require("../models/user");
const AppError = require("../utils/AppError");
const asyncHandler = require("../utils/asyncHandler");
const { verifyAccessToken } = require("../utils/tokens");

const readToken = (req) => {
  const [scheme, token] = (req.header("Authorization") || "").split(" ");
  return scheme === "Bearer" && token ? token : null;
};

const findUser = async (token) => {
  const { id } = verifyAccessToken(token);
  return User.findById(id).lean();
};

const authenticate = asyncHandler(async (req, res, next) => {
  const token = readToken(req);
  if (!token) throw AppError.unauthorized();

  let user;
  try {
    user = await findUser(token);
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) throw AppError.unauthorized("Your session has expired, please log in again");
    if (error instanceof jwt.JsonWebTokenError) throw AppError.unauthorized("Invalid token");
    throw error;
  }
  if (!user) throw AppError.unauthorized("This account no longer exists");

  req.user = user;
  next();
});

const optionalAuth = asyncHandler(async (req, res, next) => {
  const token = readToken(req);
  req.user = null;
  if (token) {
    try {
      req.user = await findUser(token);
    } catch {
      req.user = null;
    }
  }
  next();
});

const requireAdmin = (req, res, next) => {
  if (req.user?.role === "ADMIN") return next();
  next(AppError.forbidden("Only admins can access this resource"));
};

module.exports = { authenticate, optionalAuth, requireAdmin };
