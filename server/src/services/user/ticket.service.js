const Ticket = require("../../models/ticket");
const DepartmentSub = require("../../models/department-sub");
const Course = require("../../models/course");
const AppError = require("../../utils/AppError");
const paginate = require("../../utils/paginate");
const { findRootById, loadThread, addReply, LIST_POPULATE } = require("../shared/ticket-view");

const STATUS = {
  answered: { answer: 1 },
  pending: { answer: 0 },
};
const isAdmin = (user) => user.role === "ADMIN";

const create = async (user, input) => {
  const sub = await DepartmentSub.findOne({ _id: input.departmentSubID, parent: input.departmentID }).lean();
  if (!sub) throw AppError.badRequest("This sub department doesn't belong to the selected department");

  if (input.course && !(await Course.exists({ _id: input.course }))) {
    throw AppError.notFound("Course not found");
  }

  const ticket = await Ticket.create({ ...input, user: user._id, answer: 0, isAnswer: 0 });

  return Ticket.findById(ticket._id)
    .populate("departmentID", "title")
    .populate("departmentSubID", "title")
    .populate("user", "name")
    .lean();
};

const listMine = (user, { page, limit, status }) =>
  paginate(Ticket, {
    filter: { parent: null, user: user._id, ...STATUS[status] },
    sort: { updatedAt: -1, _id: -1 },
    page,
    limit,
    populate: LIST_POPULATE,
  });

const findAccessibleRoot = async (user, id) => {
  const ticket = await findRootById(id);
  if (!ticket) throw AppError.notFound("Ticket not found");
  if (!isAdmin(user) && String(ticket.user?._id) !== String(user._id)) {
    throw AppError.forbidden("You can only view your own tickets");
  }
  return ticket;
};

const getAnswer = async (user, id) => {
  const ticket = await findAccessibleRoot(user, id);
  const answer = await Ticket.findOne({ parent: ticket._id, isAnswer: 1 }).sort({ _id: -1 }).lean();
  return { ticket: ticket.body, answer: answer?.body ?? null };
};

const getThread = async (user, id) => loadThread(await findAccessibleRoot(user, id));

const sendMessage = async (user, id, { body }) => {
  const ticket = await findAccessibleRoot(user, id);
  return addReply(ticket, user, body, isAdmin(user));
};

module.exports = { create, listMine, getAnswer, getThread, sendMessage };
