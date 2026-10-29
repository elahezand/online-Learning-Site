const asyncHandler = require("../../utils/asyncHandler");
const sessionService = require("../../services/user/session.service");

exports.getOne = asyncHandler(async (req, res) => {
    res.json(await sessionService.getOne(req.user, req.parsed.data));
});