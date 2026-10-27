const { rateLimit } = require("express-rate-limit");

const limiter = ({ minutes, max, message, skipSuccessfulRequests = false }) =>
  rateLimit({
    windowMs: minutes * 60 * 1000,
    limit: max,
    standardHeaders: "draft-7",
    legacyHeaders: false,
    skipSuccessfulRequests,
    handler: (req, res, next, options) => {
      const retryAfter = Math.ceil(options.windowMs / 1000 / 60);
      res.status(options.statusCode).json({ message: `${message} Please try again in ${retryAfter} minutes.` });
    },
  });

const loginLimiter = limiter({ minutes: 15, max: 5, message: "Too many failed login attempts.", skipSuccessfulRequests: true });

const registerLimiter = limiter({ minutes: 60, max: 5, message: "Too many accounts created from this network." });

const refreshLimiter = limiter({ minutes: 15, max: 30, message: "Too many session refreshes." });

module.exports = { loginLimiter, registerLimiter, refreshLimiter };
