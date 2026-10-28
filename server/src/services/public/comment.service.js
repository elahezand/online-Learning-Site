const Comment = require("../../models/comment");

const listTop = ({ limit }) =>
  Comment.find({ mainCommendID: null, answer: 1, score: 5 })
    .sort({ _id: -1 })
    .limit(limit)
    .select("body score creator course createdAt")
    .populate("creator", "name")
    .populate("course", "name shortName")
    .lean();

module.exports = { listTop };