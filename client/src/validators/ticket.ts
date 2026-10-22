import { z } from "zod"
import { choice, message, select, text } from "./fields"

export const COURSE_SUB_DEPARTMENT = "63b688c5516a30a651e98156"

export const ticketSchema = z.object({
    title: text("Title", { min: 3, max: 80 }),
    departmentID: select("Department"),
    departmentSubID: select("Sub department"),
    priority: choice(["1", "2", "3"], "Please select a priority"),
    courseId: z.string().optional(),
    body: message("Message", { min: 10, max: 2000 }),
}).refine(data => data.departmentSubID !== COURSE_SUB_DEPARTMENT || Boolean(data.courseId), {
    message: "Please select a course",
    path: ["courseId"],
})

export type TicketFormValues = z.input<typeof ticketSchema>
export type TicketData = z.output<typeof ticketSchema>
