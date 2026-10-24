const jwt = require("jsonwebtoken");
const env = require("../config/env");

const signAccessToken = (userId) =>
  jwt.sign({ id: String(userId) }, env.jwtSecret, { expiresIn: env.jwtExpiresIn });

const verifyAccessToken = (token) => jwt.verify(token, env.jwtSecret);

module.exports = { signAccessToken, verifyAccessToken };
