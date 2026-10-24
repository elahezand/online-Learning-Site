import { z } from "zod";
import { email } from "./common";

export const newsletterSchema = z.object({ email });

export type NewsletterInput = z.infer<typeof newsletterSchema>;
