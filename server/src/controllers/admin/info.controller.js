const asyncHandler = require("../../utils/asyncHandler");
const infoService = require("../../services/admin/info.service");

exports.getDashboard = asyncHandler(async (req, res) => {
  res.json(await infoService.getDashboard(req.user));
});
