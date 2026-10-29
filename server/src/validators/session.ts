import { z } from "zod";
import { file, flag, objectId, optional, paginationQuery, text } from "./common";

export const createSessionSchema = z.object({
  course: objectId("Course"),
  title: text("Title", { min: 3, max: 120 }),
  time: text("Time", { max: 6 }).regex(/^\d{1,3}:[0-5]\d$/, "Time must look like 12:30"),
  free: flag("Free"),
  video: file("Video"),
});

export const sessionListQuery = paginationQuery.extend({
  course: optional(objectId("Course")),
  category: optional(objectId("Category")),
});

export type CreateSessionInput = z.infer<typeof createSessionSchema>;
export type SessionListQuery = z.infer<typeof sessionListQuery>;