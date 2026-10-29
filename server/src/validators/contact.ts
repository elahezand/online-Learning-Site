import { z } from "zod";
import { choice, email, optional, paginationQuery, phone, text } from "./common";

export const createContactSchema = z.object({
  name: text("Name", { min: 3, max: 80 }),
  email,
  phone,
  body: text("Message", { min: 10, max: 2000 }),
});

export const answerContactSchema = z.object({
  email,
  answer: text("Answer", { min: 2, max: 5000 }),
});

export const contactListQuery = paginationQuery.extend({
  status: optional(choice("Status", ["new", "answered"] as const)),
});

export type CreateContactInput = z.infer<typeof createContactSchema>;
export type AnswerContactInput = z.infer<typeof answerContactSchema>;