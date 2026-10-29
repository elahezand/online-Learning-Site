import { z } from "zod";
import { choice, number, objectId, optional, paginationQuery, text } from "./common";

export const myTicketsQuery = paginationQuery.extend({
  status: optional(choice("Status", ["pending", "answered"] as const)),
});

export const createTicketSchema = z.object({
  departmentID: objectId("Department"),
  departmentSubID: objectId("Sub department"),
  priority: number("Priority", { min: 1, max: 3 }),
  title: text("Title", { min: 3, max: 120 }),
  body: text("Message", { min: 10, max: 5000 }),
  course: optional(objectId("Course")),
});

export const answerTicketSchema = z.object({
  ticketID: objectId("Ticket id"),
  body: text("Answer", { min: 2, max: 5000 }),
});

export const ticketMessageSchema = z.object({
  body: text("Message", { min: 1, max: 5000 }),
});

export type CreateTicketInput = z.infer<typeof createTicketSchema>;
export type AnswerTicketInput = z.infer<typeof answerTicketSchema>;
