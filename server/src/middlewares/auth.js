const User = require("../models/user");
const AppError = require("../utils/AppError");
const asyncHandler = require("../utils/asyncHandler");
const { verifyToken } = require("../utils/tokens");

const readToken = (req) => {
  const [scheme, token] = (req.header("Authorization") || "").split(" ");
  return scheme === "Bearer" && token ? token : null;
};

const findUser = async (token) => {
  const { payload, expired } = verifyToken(token);
  if (!payload) {
    throw AppError.unauthorized(expired ? "Your session has expired, please log in again" : "Invalid token");
  }
  const user = await User.findById(payload.id).lean();
  if (!user) throw AppError.unauthorized("This account no longer exists");
  return user;
};

const authenticate = asyncHandler(async (req, res, next) => {
  const token = readToken(req);
  if (!token) throw AppError.unauthorized();
  req.user = await findUser(token);
  next();
});

const optionalAuth = asyncHandler(async (req, res, next) => {
  const token = readToken(req);
  req.user = token ? await findUser(token).catch(() => null) : null;
  next();
});

const requireAdmin = (req, res, next) => {
  if (req.user?.role === "ADMIN") return next();
  next(AppError.forbidden("Only admins can access this resource"));
};

module.exports = { authenticate, optionalAuth, requireAdmin };
