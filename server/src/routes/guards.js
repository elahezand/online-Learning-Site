const { authenticate, optionalAuth, requireAdmin } = require("../middlewares/auth");

module.exports = {
  user: authenticate,
  admin: [authenticate, requireAdmin],
  optionalUser: optionalAuth,
};
