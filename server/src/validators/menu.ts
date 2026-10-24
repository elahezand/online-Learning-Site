import { z } from "zod";
import { objectId, optional, text } from "./common";

export const createMenuSchema = z.object({
  title: text("Title", { min: 2, max: 60 }),
  href: text("Link", { max: 200 }).regex(/^(\/|https?:\/\/)/, "Link must start with / or http"),
  parent: optional(objectId("Parent menu")),
});

export type CreateMenuInput = z.infer<typeof createMenuSchema>;
