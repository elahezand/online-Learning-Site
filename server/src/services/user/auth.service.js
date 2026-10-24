const CourseUser = require("../../models/course-user");
const Notification = require("../../models/notification");

const getProfile = async (user) => {
  const [enrollments, notifications] = await Promise.all([
    CourseUser.find({ user: user._id }).populate("course").sort({ _id: -1 }).lean(),
    Notification.find({ admin: user._id, see: 0 }).select("msg").sort({ _id: -1 }).lean(),
  ]);

  return {
    ...user,
    courses: enrollments.map((enrollment) => enrollment.course).filter(Boolean),
    notifications: notifications.map(({ _id, msg }) => ({ msg, _id })),
  };
};

module.exports = { getProfile };
