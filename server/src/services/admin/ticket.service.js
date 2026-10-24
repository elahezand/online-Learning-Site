const AppError = require("../../utils/AppError");
const { toListItem, findRoots, findRootById, addReply } = require("../shared/ticket-view");

const list = async () => (await findRoots()).map(toListItem);

const answer = async (admin, { ticketID, body }) => {
  const ticket = await findRootById(ticketID);
  if (!ticket) throw AppError.notFound("Ticket not found");
  return addReply(ticket, admin, body, true);
};

module.exports = { list, answer };
