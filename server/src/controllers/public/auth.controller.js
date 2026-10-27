const asyncHandler = require("../../utils/asyncHandler");
const authService = require("../../services/public/auth.service");

const userAgent = (req) => req.get("user-agent")?.slice(0, 300);

exports.register = asyncHandler(async (req, res) => {
  res.status(201).json(await authService.register(req.parsed.data, userAgent(req)));
});

exports.login = asyncHandler(async (req, res) => {
  res.json(await authService.login(req.parsed.data, userAgent(req)));
});

exports.refresh = asyncHandler(async (req, res) => {
  res.json(await authService.refresh(req.parsed.data));
});

exports.logout = asyncHandler(async (req, res) => {
  res.json(await authService.logout(req.parsed.data));
});
