import { z } from "zod"
import { email, message, phone, text } from "./fields"

export const contactSchema = z.object({
    name: text("Name", { min: 3, max: 40 }),
    email,
    phone,
    body: message("Message", { min: 10, max: 1000 }),
})

export const answerSchema = message("Answer")

export type ContactFormValues = z.input<typeof contactSchema>
export type ContactData = z.output<typeof contactSchema>
