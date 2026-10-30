const CourseUser = require("../../models/course-user");
const Notification = require("../../models/notification");

const getProfile = async (user) => {
  const [enrollments, notifications] = await Promise.all([
    CourseUser.find({ user: user._id }).populate("course").sort({ _id: -1 }).lean(),
    Notification.find({ user: user._id, see: 0 }).select("msg type link").sort({ _id: -1 }).lean(),
  ]);

  return {
    ...user,
    courses: enrollments.map((enrollment) => enrollment.course).filter(Boolean),
    notifications,
  };
};

module.exports = { getProfile };