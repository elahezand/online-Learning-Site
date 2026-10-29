const Session = require("../../models/session");
const CourseUser = require("../../models/course-user");
const AppError = require("../../utils/AppError");
const { generateVideoToken, verifyVideoToken } = require("../../utils/tokens");
const { findByShortName, toPublicSession, toPublicSessions } = require("../public/course.service");

const canWatchCourse = async (user, courseId) =>
  user.role === "ADMIN" || Boolean(await CourseUser.exists({ user: user._id, course: courseId }));

const videoUrl = (session, user) =>
  session.video ? `/v1/sessions/${session._id}/video?token=${generateVideoToken(session._id, user._id)}` : null;

const getOne = async (user, { shortName, sessionID }) => {
  const course = await findByShortName(shortName);

  const [session, sessions, canWatch] = await Promise.all([
    Session.findOne({ _id: sessionID, course: course._id }).lean(),
    Session.find({ course: course._id }).sort({ _id: 1 }).lean(),
    canWatchCourse(user, course._id),
  ]);
  if (!session) throw AppError.notFound("Session not found");
  if (!canWatch && session.free !== 1) {
    throw AppError.forbidden("Register in this course to watch this session");
  }

  return {
    session: { ...toPublicSession(session, true), videoUrl: videoUrl(session, user) },
    sessions: toPublicSessions(sessions, canWatch),
  };
};

const findVideo = async ({ id, token }) => {
  const claims = verifyVideoToken(token);
  if (!claims || claims.sid !== String(id)) throw AppError.forbidden("This video link has expired, please reload the page");

  const session = await Session.findById(id).select("video").lean();
  if (!session?.video) throw AppError.notFound("Video not found");
  return session.video;
};

module.exports = { getOne, findVideo };
