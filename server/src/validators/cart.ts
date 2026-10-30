import { z } from "zod";
import { choice, objectId, optional, paginationQuery, text } from "./common";

export const addCartItemSchema = z.object({
  courseId: objectId("Course"),
});

export const cartCourseParams = z.object({
  courseId: objectId("Course"),
});

export const applyCouponSchema = z.object({
  code: text("Code", { max: 30 }),
});

export const cartListQuery = paginationQuery.extend({
  status: optional(choice("Status", ["active", "abandoned", "converted"] as const)),
});