const Session = require("../../models/session");
const CourseUser = require("../../models/course-user");
const AppError = require("../../utils/AppError");
const { findByShortName, hideVideos } = require("../public/course.service");

const getOne = async (user, { shortName, sessionID }) => {
  const course = await findByShortName(shortName);

  const [session, sessions, registered] = await Promise.all([
    Session.findOne({ _id: sessionID, course: course._id }).lean(),
    Session.find({ course: course._id }).sort({ _id: 1 }).lean(),
    CourseUser.exists({ user: user._id, course: course._id }),
  ]);
  if (!session) throw AppError.notFound("Session not found");

  const canWatch = Boolean(registered) || user.role === "ADMIN";
  if (!canWatch && session.free !== 1) {
    throw AppError.forbidden("Register in this course to watch this session");
  }

  return { session, sessions: hideVideos(sessions, canWatch) };
};

module.exports = { getOne };