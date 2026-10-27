import { z } from "zod";
import { choice, number, objectId, optional, paginationQuery, sortChoice, text } from "./common";

export const createCommentSchema = z.object({
  body: text("Comment", { min: 3, max: 2000 }),
  courseShortName: text("Course", { max: 80 }),
  score: number("Score", { min: 1, max: 5 }),
});

export const answerCommentSchema = z.object({
  body: text("Answer", { min: 2, max: 2000 }),
});

export const commentListQuery = paginationQuery.extend({
  search: optional(text("Search", { max: 80 })),
  course: optional(objectId("Course")),
  score: optional(number("Score", { min: 1, max: 5 })),
  status: optional(choice("Status", ["pending", "accepted"] as const)),
  sort: sortChoice(["newest", "oldest", "score"] as const),
});

export type CommentListQuery = z.infer<typeof commentListQuery>;
export type CreateCommentInput = z.infer<typeof createCommentSchema>;
export type AnswerCommentInput = z.infer<typeof answerCommentSchema>;