const Ticket = require("../../models/ticket");

const ROOT = { parent: null };

const titleOf = (value) => (value && typeof value === "object" ? value.title ?? null : null);

const toListItem = (ticket) => ({
  ...ticket,
  departmentID: titleOf(ticket.departmentID),
  departmentSubID: titleOf(ticket.departmentSubID),
  user: ticket.user?.name ?? null,
  course: ticket.course?.name ?? null,
});

const findRoots = (filter = {}) =>
  Ticket.find({ ...ROOT, ...filter })
    .populate("user", "name")
    .populate("course", "name")
    .populate("departmentID", "title")
    .populate("departmentSubID", "title")
    .sort({ updatedAt: -1, _id: -1 })
    .lean();

const loadThread = async (ticket) => {
  const replies = await Ticket.find({ parent: ticket._id })
    .populate("user", "name role")
    .sort({ createdAt: 1, _id: 1 })
    .lean();

  const opening = {
    _id: ticket._id,
    body: ticket.body,
    isAnswer: 0,
    user: ticket.user,
    createdAt: ticket.createdAt,
  };

  const messages = replies.map((reply) => ({
    _id: reply._id,
    body: reply.body,
    isAnswer: reply.isAnswer === 1 ? 1 : 0,
    user: reply.user,
    createdAt: reply.createdAt,
  }));

  return { ticket, messages: [opening, ...messages] };
};

const findRootById = (id) =>
  Ticket.findOne({ _id: id, ...ROOT })
    .populate("user", "name role")
    .populate("course", "name")
    .populate("departmentID", "title")
    .populate("departmentSubID", "title")
    .lean();

const addReply = async (root, author, body, fromAdmin) => {
  const reply = await Ticket.create({
    title: root.title,
    body,
    parent: root._id,
    priority: root.priority,
    user: author._id,
    isAnswer: fromAdmin ? 1 : 0,
    answer: 0,
    departmentID: root.departmentID?._id ?? root.departmentID,
    departmentSubID: root.departmentSubID?._id ?? root.departmentSubID,
  });
  await Ticket.updateOne({ _id: root._id }, { answer: fromAdmin ? 1 : 0 });
  return reply;
};

const LIST_POPULATE = [
  { path: "user", select: "name" },
  { path: "course", select: "name" },
  { path: "departmentID", select: "title" },
  { path: "departmentSubID", select: "title" },
];

module.exports = { toListItem, findRoots, loadThread, findRootById, addReply,LIST_POPULATE };
