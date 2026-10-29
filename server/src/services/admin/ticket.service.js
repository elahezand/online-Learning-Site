const Ticket = require("../../models/ticket");
const AppError = require("../../utils/AppError");
const paginate = require("../../utils/paginate");
const { findRootById, addReply, LIST_POPULATE } = require("../shared/ticket-view");

const STATUS = {
  open: { answer: 0 },
  answered: { answer: 1 },
};

const list = ({ page, limit, status }) =>
  paginate(Ticket, {
    filter: { parent: null, ...STATUS[status] },
    sort: { answer: 1, priority: -1, _id: -1 },
    page,
    limit,
    populate: LIST_POPULATE,
  });

const answer = async (admin, { ticketID, body }) => {
  const ticket = await findRootById(ticketID);
  if (!ticket) throw AppError.notFound("Ticket not found");
  return addReply(ticket, admin, body, true);
};

module.exports = { list, answer };