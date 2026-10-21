import { z } from "zod"
import { choice, message, select, text } from "./fields"

export const ticketSchema = z.object({
    title: text("Title", { min: 3, max: 80 }),
    departmentID: select("Department"),
    departmentSubID: select("Sub department"),
    priority: choice(["1", "2", "3"], "Please select a priority"),
    courseId: z.string().optional(),
    body: message("Message", { min: 10, max: 2000 }),
})

export type TicketFormValues = z.input<typeof ticketSchema>
export type TicketData = z.output<typeof ticketSchema>
