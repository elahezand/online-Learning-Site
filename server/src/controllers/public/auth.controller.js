const asyncHandler = require("../../utils/asyncHandler");
const authService = require("../../services/public/auth.service");
const { registerSchema, loginSchema } = require("../../validators/auth");

exports.register = asyncHandler(async (req, res) => {
  const result = await authService.register(registerSchema.parse(req.body));
  res.status(201).json(result);
});

exports.login = asyncHandler(async (req, res) => {
  res.json(await authService.login(loginSchema.parse(req.body)));
});
