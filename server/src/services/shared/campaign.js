const Campaign = require("../../models/campaign");
const Course = require("../../models/course");
const AppError = require("../../utils/AppError");
const withTransaction = require("../../utils/transaction");

const toView = (campaign) =>
  campaign ? { _id: campaign._id, percent: campaign.percent, endsAt: campaign.endsAt, createdAt: campaign.createdAt } : null;

const getActiveCampaign = async () => toView(await Campaign.findOne({ status: "active" }).lean());

const startCampaign = (user, { percent, endsAt }) =>
  withTransaction(async (session) => {
    if (await Campaign.exists({ status: "active" }).session(session)) {
      throw AppError.conflict("A campaign is already running — end it first");
    }

    const courses = await Course.find().select("discount").session(session).lean();
    const [campaign] = await Campaign.create(
      [{ percent, endsAt, creator: user._id, previous: courses.map((course) => ({ course: course._id, discount: course.discount ?? 0 })) }],
      { session }
    );

    const raise = courses.filter((course) => (course.discount ?? 0) < percent);
    if (raise.length) {
      await Course.bulkWrite(
        raise.map((course) => ({ updateOne: { filter: { _id: course._id }, update: { $set: { discount: percent } } } })),
        { session }
      );
    }

    return toView(campaign);
  });

const endCampaign = (filter = {}) =>
  withTransaction(async (session) => {
    const campaign = await Campaign.findOne({ status: "active", ...filter }).session(session);
    if (!campaign) return null;

    if (campaign.previous.length) {
      await Course.bulkWrite(
        campaign.previous.map(({ course, discount }) => ({
          updateOne: { filter: { _id: course }, update: { $set: { discount } } },
        })),
        { session }
      );
    }

    campaign.status = "ended";
    campaign.endedAt = new Date();
    await campaign.save({ session });
    return toView(campaign);
  });

const endExpiredCampaign = () => endCampaign({ endsAt: { $lte: new Date() } });

module.exports = { getActiveCampaign, startCampaign, endCampaign, endExpiredCampaign };
