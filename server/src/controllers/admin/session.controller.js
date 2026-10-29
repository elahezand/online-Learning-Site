const asyncHandler = require("../../utils/asyncHandler");
const sessionService = require("../../services/admin/session.service");

exports.getAll = asyncHandler(async (req, res) => {
  res.json(await sessionService.list(req.parsed.data));
});

exports.create = asyncHandler(async (req, res) => {
  res.status(201).json(await sessionService.create(req.parsed.data));
});

exports.remove = asyncHandler(async (req, res) => {
  res.json(await sessionService.remove(req.parsed.data.id));
});