import { z } from "zod";
import { number, text } from "./common";

export const createCommentSchema = z.object({
  body: text("Comment", { min: 3, max: 2000 }),
  courseShortName: text("Course", { max: 80 }),
  score: number("Score", { min: 1, max: 5 }),
});

export const answerCommentSchema = z.object({
  body: text("Answer", { min: 2, max: 2000 }),
});

export type CreateCommentInput = z.infer<typeof createCommentSchema>;
export type AnswerCommentInput = z.infer<typeof answerCommentSchema>;
