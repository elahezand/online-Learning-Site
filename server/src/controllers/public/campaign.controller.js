const asyncHandler = require("../../utils/asyncHandler");
const { getActiveCampaign } = require("../../services/shared/campaign");

exports.getActive = asyncHandler(async (req, res) => {
  res.json(await getActiveCampaign());
});
