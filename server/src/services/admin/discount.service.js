const Off = require("../../models/off");
const Course = require("../../models/course");
const AppError = require("../../utils/AppError");
const paginate = require("../../utils/paginate");
const { startCampaign, endCampaign } = require("../shared/campaign");

const create = async (user, input) => {
  if (!(await Course.exists({ _id: input.course }))) throw AppError.notFound("Course not found");
  if (await Off.exists({ code: input.code, course: input.course })) {
    throw AppError.conflict("This code already exists for this course");
  }
  return Off.create({ ...input, uses: 0, creator: user._id });
};

const list = ({ page, limit }) =>
  paginate(Off, { page, limit, populate: [{ path: "creator", select: "name" }, { path: "course", select: "name shortName" }] });

const remove = async (id) => {
  const discount = await Off.findByIdAndDelete(id).lean();
  if (!discount) throw AppError.notFound("Discount code not found");
  return discount;
};

const startSiteWide = (user, input) => startCampaign(user, input);

const endSiteWide = async () => {
  const campaign = await endCampaign();
  if (!campaign) throw AppError.notFound("No campaign is running");
  return campaign;
};

module.exports = { create, list, remove, startSiteWide, endSiteWide };