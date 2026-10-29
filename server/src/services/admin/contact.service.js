const Contact = require("../../models/contact");
const AppError = require("../../utils/AppError");
const paginate = require("../../utils/paginate");
const { sendMail } = require("../../utils/mailer");

const STATUS = {
  new: { answer: 0 },
  answered: { answer: 1 },
};

const list = ({ page, limit, status }) =>
  paginate(Contact, {
    filter: { ...STATUS[status] },
    sort: { answer: 1, _id: -1 },
    page,
    limit,
  });

const answer = async ({ email, answer: text }) => {
  const contact = await Contact.findOne({ email }).sort({ _id: -1 });
  if (!contact) throw AppError.notFound("No message was found from this email");

  await sendMail({ to: email, subject: "Reply to your message", text });

  await Contact.updateMany({ email, answer: 0 }, { answer: 1 });
  return { message: "Your answer was emailed successfully" };
};

const remove = async (id) => {
  const contact = await Contact.findByIdAndDelete(id).lean();
  if (!contact) throw AppError.notFound("Message not found");
  return contact;
};

module.exports = { list, answer, remove };