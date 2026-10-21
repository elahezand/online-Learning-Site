import { z } from "zod"
import { email } from "./fields"

export const newsletterSchema = z.object({ email })

export type NewsletterFormValues = z.input<typeof newsletterSchema>
export type NewsletterData = z.output<typeof newsletterSchema>
