const Session = require("../../models/session");
const Course = require("../../models/course");
const AppError = require("../../utils/AppError");
const paginate = require("../../utils/paginate");
const { removeUpload } = require("../../utils/files");

const buildFilter = async ({ course, category }) => {
  if (course) return { course };
  if (category) return { course: { $in: await Course.find({ categoryID: category }).distinct("_id") } };
  return {};
};

const list = async ({ page, limit, ...query }) =>
  paginate(Session, {
    filter: await buildFilter(query),
    page,
    limit,
    populate: [{ path: "course", select: "name shortName" }],
  });

const create = async ({ course, video, ...input }) => {
  if (!(await Course.exists({ _id: course }))) throw AppError.notFound("Course not found");
  return Session.create({ ...input, course, video: video.filename });
};

const remove = async (id) => {
  const session = await Session.findByIdAndDelete(id).lean();
  if (!session) throw AppError.notFound("Session not found");
  removeUpload(session.video);
  return session;
};

module.exports = { list, create, remove };