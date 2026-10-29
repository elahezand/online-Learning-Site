const Course = require("../../models/course");
const Category = require("../../models/category");
const Session = require("../../models/session");
const Comment = require("../../models/comment");
const AppError = require("../../utils/AppError");
const { removeUpload } = require("../../utils/files");

const ensureShortNameFree = async (shortName, exceptId) => {
  const filter = exceptId ? { shortName, _id: { $ne: exceptId } } : { shortName };
  if (await Course.exists(filter)) throw AppError.conflict("This course link is already taken");
};

const ensureCategory = async (categoryID) => {
  if (categoryID && !(await Category.exists({ _id: categoryID }))) throw AppError.notFound("Category not found");
};

const withCreator = (id) => Course.findById(id).populate("creator", "name username").populate("categoryID").lean();

const create = async (user, { cover, ...input }) => {
  await ensureShortNameFree(input.shortName);
  await ensureCategory(input.categoryID);
  const course = await Course.create({
    ...input,
    discount: input.discount ?? 0,
    isComplete: input.isComplete ?? 0,
    cover: cover.filename,
    creator: user._id,
  });
  return withCreator(course._id);
};

const update = async (id, { cover, ...input }) => {
  const course = await Course.findById(id);
  if (!course) throw AppError.notFound("Course not found");

  if (input.shortName) await ensureShortNameFree(input.shortName, id);
  await ensureCategory(input.categoryID);

  const oldCover = course.cover;
  for (const [key, value] of Object.entries(input)) {
    if (value !== undefined) course.set(key, value);
  }
  if (cover) course.cover = cover.filename;

  await course.save();
  if (cover && oldCover && oldCover !== cover.filename) removeUpload(oldCover);

  return withCreator(course._id);
};

const remove = async (id) => {
  const course = await Course.findByIdAndDelete(id).lean();
  if (!course) throw AppError.notFound("Course not found");

  const sessions = await Session.find({ course: course._id }).select("video").lean();
  await Promise.all([Session.deleteMany({ course: course._id }), Comment.deleteMany({ course: course._id })]);

  removeUpload(course.cover);
  sessions.forEach((session) => removeUpload(session.video));
  return course;
};

const listSessions = () => Session.find().populate("course", "name shortName").sort({ _id: -1 }).lean();

const createSession = async (courseId, { video, ...input }) => {
  if (!(await Course.exists({ _id: courseId }))) throw AppError.notFound("Course not found");
  return Session.create({ ...input, course: courseId, video: video.filename });
};

const removeSession = async (id) => {
  const session = await Session.findByIdAndDelete(id).lean();
  if (!session) throw AppError.notFound("Session not found");
  removeUpload(session.video);
  return session;
};

const listOptions = () => Course.find().select("name").sort({ name: 1 }).lean();

module.exports = { create, update, remove, listSessions, createSession, removeSession, listOptions };