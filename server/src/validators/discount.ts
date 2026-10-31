import { z } from "zod";
import { number, objectId, text } from "./common";

const code = text("Code", { min: 3, max: 30 }).regex(/^[A-Za-z0-9_-]+$/, "Code can only contain letters, numbers, - and _");

export const createDiscountSchema = z.object({
  code,
  percent: number("Percent", { min: 1, max: 100 }),
  course: objectId("Course"),
  max: number("Usage limit", { min: 1, max: 1_000_000 }),
});

export const siteWideDiscountSchema = z.object({
  percent: number("Discount", { min: 1, max: 100 }),
  endsAt: z.coerce
    .date({ error: "End date is not valid" })
    .refine((date) => date.getTime() > Date.now(), "End date must be in the future"),
});

export type CreateDiscountInput = z.infer<typeof createDiscountSchema>;
export type SiteWideDiscountInput = z.infer<typeof siteWideDiscountSchema>;
