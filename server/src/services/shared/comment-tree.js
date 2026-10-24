const nestAnswers = (comments) => {
  const answers = new Map();
  for (const comment of comments) {
    if (comment.mainCommendID) answers.set(String(comment.mainCommendID), comment);
  }
  return comments
    .filter((comment) => !comment.mainCommendID)
    .map((comment) => ({
      ...comment,
      course: comment.course?.name ?? null,
      answerContent: answers.get(String(comment._id)) ?? null,
    }));
};

module.exports = { nestAnswers };
