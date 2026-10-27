const { hash, compare } = require("bcrypt");
const { sign, verify, TokenExpiredError } = require("jsonwebtoken");
const crypto = require("crypto");

const ALGORITHM = "HS256";
const ACCESS_TOKEN_TTL_SECONDS = 15 * 60;
const REFRESH_TOKEN_TTL_SECONDS = 15 * 24 * 60 * 60;

const hashPassword = (password) => hash(password, 12);

const verifyPassword = (password, hashedPassword) => compare(password, hashedPassword);

const generateToken = (data) =>
  sign({ ...data }, process.env.ACCESS_TOKEN_SECRET, {
    algorithm: ALGORITHM,
    expiresIn: ACCESS_TOKEN_TTL_SECONDS,
  });

const generateRefreshToken = (data) =>
  sign({ ...data }, process.env.REFRESH_TOKEN_SECRET, {
    algorithm: ALGORITHM,
    expiresIn: REFRESH_TOKEN_TTL_SECONDS,
    jwtid: crypto.randomUUID(),
  });

const safeVerify = (token, secret) => {
  try {
    return { payload: verify(token, secret, { algorithms: [ALGORITHM] }), expired: false };
  } catch (err) {
    return { payload: null, expired: err instanceof TokenExpiredError };
  }
};

const verifyToken = (token) => safeVerify(token, process.env.ACCESS_TOKEN_SECRET);

const verifyRefreshToken = (token) => safeVerify(token, process.env.REFRESH_TOKEN_SECRET);

const hashToken = (token) => crypto.createHash("sha256").update(String(token)).digest("hex");

const compareTokenHash = (token, storedHash) => {
  if (!token || !storedHash) return false;
  const a = Buffer.from(hashToken(token), "hex");
  const b = Buffer.from(String(storedHash), "hex");
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
};

module.exports = {
  ACCESS_TOKEN_TTL_SECONDS,
  REFRESH_TOKEN_TTL_SECONDS,
  hashPassword,
  verifyPassword,
  generateToken,
  generateRefreshToken,
  verifyToken,
  verifyRefreshToken,
  hashToken,
  compareTokenHash,
};
