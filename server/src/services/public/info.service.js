const Info = require("../../models/infos");
const Course = require("../../models/course");
const User = require("../../models/user");
const Session = require("../../models/session");

const sessionMinutes = (time = "") => {
  const [minutes = "0", seconds = "0"] = String(time).split(":");
  return (Number(minutes) || 0) + (Number(seconds) || 0) / 60;
};

const getIndex = async () => {
  const [info, coursesCount, usersCount, sessions] = await Promise.all([
    Info.findOne().lean(),
    Course.countDocuments(),
    User.countDocuments(),
    Session.find().select("time").lean(),
  ]);

  const totalTime = Math.round(sessions.reduce((total, session) => total + sessionMinutes(session.time), 0));

  return {
    phone: info?.phone ?? null,
    email: info?.email ?? null,
    coursesCount,
    usersCount,
    totalTime,
  };
};

module.exports = { getIndex };
