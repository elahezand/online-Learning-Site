const Course = require("../../models/course");
const User = require("../../models/user");
const CourseUser = require("../../models/course-user");
const Ticket = require("../../models/ticket");
const Comment = require("../../models/comment");
const Contact = require("../../models/contact");

const LIMIT = 5;

const startOfMonth = () => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), 1);
};

const countStats = async () => {
  const [students, newStudents, courses, presell, enrollments, openTickets, totalTickets, pendingComments, totalComments, newMessages, totalMessages] =
    await Promise.all([
      User.countDocuments({ role: "USER" }),
      User.countDocuments({ role: "USER", createdAt: { $gte: startOfMonth() } }),
      Course.countDocuments(),
      Course.countDocuments({ status: "presell" }),
      CourseUser.countDocuments(),
      Ticket.countDocuments({ parent: null, answer: 0 }),
      Ticket.countDocuments({ parent: null }),
      Comment.countDocuments({ mainCommendID: null, answer: 0 }),
      Comment.countDocuments({ mainCommendID: null }),
      Contact.countDocuments({ answer: 0 }),
      Contact.countDocuments(),
    ]);

  return { students, newStudents, courses, presell, enrollments, openTickets, totalTickets, pendingComments, totalComments, newMessages, totalMessages };
};

const coursesByCategory = () =>
  Course.aggregate([
    { $group: { _id: "$categoryID", value: { $sum: 1 } } },
    { $lookup: { from: "categories", localField: "_id", foreignField: "_id", as: "category" } },
    { $unwind: "$category" },
    { $project: { _id: 0, name: "$category.title", value: 1 } },
    { $sort: { value: -1 } },
  ]);

const topCourses = () =>
  CourseUser.aggregate([
    { $group: { _id: "$course", registers: { $sum: 1 } } },
    { $sort: { registers: -1 } },
    { $limit: LIMIT },
    { $lookup: { from: "courses", localField: "_id", foreignField: "_id", as: "course" } },
    { $unwind: "$course" },
    { $project: { _id: 1, name: "$course.name", registers: 1 } },
  ]);

const latest = (Model, filter, populate = []) => {
  let query = Model.find(filter).sort({ _id: -1 }).limit(LIMIT).lean();
  for (const option of populate) query = query.populate(option);
  return query;
};

const getDashboard = async (admin) => {
  const [stats, byCategory, popular, openTickets, pendingComments, recentOrders, lastUsers] = await Promise.all([
    countStats(),
    coursesByCategory(),
    topCourses(),
    latest(Ticket, { parent: null, answer: 0 }, [{ path: "user", select: "name" }]),
    latest(Comment, { mainCommendID: null, answer: 0 }, [{ path: "creator", select: "name" }, { path: "course", select: "name" }]),
    latest(CourseUser, {}, [{ path: "user", select: "name" }, { path: "course", select: "name shortName" }]),
    latest(User, {}),
  ]);

  return {
    adminName: admin.name,
    stats,
    coursesByCategory: byCategory,
    topCourses: popular,
    openTickets,
    pendingComments,
    recentOrders,
    lastUsers,
  };
};

module.exports = { getDashboard };