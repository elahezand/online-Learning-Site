const Comment = require("../../models/comment");
const AppError = require("../../utils/AppError");
const { nestAnswers } = require("../shared/comment-tree");
const { ADMIN_USER } = require("../shared/selects");

const list = async () => {
  const comments = await Comment.find()
    .populate("creator", ADMIN_USER)
    .populate("course", "name shortName")
    .sort({ _id: -1 })
    .lean();
  return nestAnswers(comments);
};

const setApproval = async (id, answer) => {
  const comment = await Comment.findByIdAndUpdate(id, { answer }, { new: true }).lean();
  if (!comment) throw AppError.notFound("Comment not found");
  return comment;
};

const accept = (id) => setApproval(id, 1);

const reject = (id) => setApproval(id, 0);

const answer = async (user, id, { body }) => {
  const main = await Comment.findOneAndUpdate({ _id: id, isAnswer: { $ne: 1 } }, { answer: 1 }, { new: true }).lean();
  if (!main) throw AppError.notFound("Comment not found");

  return Comment.create({
    body,
    course: main.course,
    creator: user._id,
    answer: 1,
    isAnswer: 1,
    mainCommendID: main._id,
    score: 5,
  });
};

const remove = async (id) => {
  const comment = await Comment.findByIdAndDelete(id).lean();
  if (!comment) throw AppError.notFound("Comment not found");
  await Comment.deleteMany({ mainCommendID: comment._id });
  return comment;
};

module.exports = { list, accept, reject, answer, remove };
