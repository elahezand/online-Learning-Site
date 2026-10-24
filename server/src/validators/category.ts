import { z } from "zod";
import { slug, text } from "./common";

export const categorySchema = z.object({
  title: text("Title", { min: 2, max: 60 }),
  name: slug("Short name"),
});

export type CategoryInput = z.infer<typeof categorySchema>;
