import { z } from "zod";
import { number, objectId, text } from "./common";

const code = text("Code", { min: 3, max: 30 }).regex(/^[A-Za-z0-9_-]+$/, "Code can only contain letters, numbers, - and _");

export const createDiscountSchema = z.object({
  code,
  percent: number("Percent", { min: 1, max: 100 }),
  course: objectId("Course"),
  max: number("Usage limit", { min: 1, max: 1_000_000 }),
});

export const applyDiscountSchema = z.object({
  code: text("Code", { max: 30 }),
  course: objectId("Course"),
});

export const siteWideDiscountSchema = z.object({
  discount: number("Discount", { min: 0, max: 100 }),
});

export type CreateDiscountInput = z.infer<typeof createDiscountSchema>;
export type ApplyDiscountInput = z.infer<typeof applyDiscountSchema>;
