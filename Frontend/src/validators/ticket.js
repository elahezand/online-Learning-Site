import { z } from "zod"
import { message, select, text } from "./fields"

export const ticketSchema = z.object({
    title: text("Title", { min: 3, max: 80 }),
    departmentID: select("Department"),
    departmentSubID: select("Sub department"),
    priority: z.enum(["1", "2", "3"], { error: "Please select a priority" }),
    courseId: z.string().optional(),
    body: message("Message", { min: 10, max: 2000 }),
})
