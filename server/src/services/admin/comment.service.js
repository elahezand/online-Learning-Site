const Comment = require("../../models/comment");
const AppError = require("../../utils/AppError");
const paginate = require("../../utils/paginate");
const { searchFilter } = require("../shared/filter");
const { ADMIN_USER } = require("../shared/selects");

const SORTS = {
  newest: { _id: -1 },
  oldest: { _id: 1 },
  score: { score: -1, _id: -1 },
};

const STATUS = {
  pending: { answer: 0 },
  accepted: { answer: 1 },
};

const TOP_LEVEL = { mainCommendID: null };

const baseFilter = ({ search, course, score, status }) => ({
  ...TOP_LEVEL,
  ...searchFilter("body", search),
  ...(course && { course }),
  ...(score && { score }),
  ...STATUS[status],
});

const attachAnswers = async (comments) => {
  const answers = await Comment.find({ mainCommendID: { $in: comments.map((comment) => comment._id) } })
    .populate("creator", ADMIN_USER)
    .lean();
  const answerOf = new Map(answers.map((answer) => [String(answer.mainCommendID), answer]));

  return comments.map((comment) => ({
    ...comment,
    answerContent: answerOf.get(String(comment._id)) ?? null,
  }));
};

const list = async ({ page, limit, sort, ...query }) => {
  const result = await paginate(Comment, {
    filter: baseFilter(query),
    sort: SORTS[sort],
    page,
    limit,
    populate: [{ path: "creator", select: ADMIN_USER }, { path: "course", select: "name shortName" }],
  });

  return { ...result, items: await attachAnswers(result.items) };
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