const Course = require("../../models/course");
const User = require("../../models/user");
const Session = require("../../models/session");
const CourseUser = require("../../models/course-user");

const LAST_USERS = 5;

const getDashboard = async (admin) => {
  const [registers, courses, sessions, lastUsers] = await Promise.all([
    CourseUser.countDocuments(),
    Course.countDocuments(),
    Session.countDocuments(),
    User.find().sort({ _id: -1 }).limit(LAST_USERS).lean(),
  ]);

  return {
    infos: [
      { count: registers, icon: "fa-solid fa-users", title: "Enrollees" },
      { count: courses, icon: "fa-solid fa-graduation-cap", title: "Courses" },
      { count: sessions, icon: "fa-solid fa-photo-film", title: "Sessions" },
    ],
    lastUsers,
    adminName: admin.name,
  };
};

module.exports = { getDashboard };
