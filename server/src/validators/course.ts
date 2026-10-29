import { z } from "zod";
import { choice, file, flag, number, objectId, optional, paginationQuery, slug, sortChoice, text } from "./common";

const STATUSES = ["start", "presell"] as const;

const fields = {
  name: text("Name", { min: 3, max: 120 }),
  description: text("Description", { min: 10, max: 5000 }),
  support: text("Support", { max: 120 }),
  shortName: slug("Course link"),
  price: number("Price", { min: 0, max: 1_000_000_000 }),
  status: choice("Status", STATUSES),
  discount: number("Discount", { min: 0, max: 100 }),
  categoryID: objectId("Category"),
  isComplete: flag("Completion state"),
};

export const createCourseSchema = z.object({
  ...fields,
  support: optional(fields.support),
  discount: optional(fields.discount),
  isComplete: optional(fields.isComplete),
  cover: file("Cover image"),
});

export const updateCourseSchema = z.object({
  name: optional(fields.name),
  description: optional(fields.description),
  support: optional(fields.support),
  shortName: optional(fields.shortName),
  price: optional(fields.price),
  status: optional(fields.status),
  discount: optional(fields.discount),
  categoryID: optional(fields.categoryID),
  isComplete: optional(fields.isComplete),
  cover: optional(file("Cover image")),
});

export const COURSE_SORTS = ["newest", "oldest", "price-asc", "price-desc", "name"] as const;

export const courseListQuery = paginationQuery.extend({
  search: optional(text("Search", { max: 80 })),
  category: optional(text("Category", { max: 80 })),
  status: optional(fields.status),
  free: optional(flag("Free")),
  sort: sortChoice(COURSE_SORTS),
});

export const popularQuery = z.object({
  limit: optional(number("Limit", { min: 1, max: 20 })).default(8),
});

export const shortNameParams = z.object({ shortName: text("Course link", { max: 80 }) });

export type CourseListQuery = z.infer<typeof courseListQuery>;
export type CreateCourseInput = z.infer<typeof createCourseSchema>;
export type UpdateCourseInput = z.infer<typeof updateCourseSchema>;
