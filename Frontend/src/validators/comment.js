import { z } from "zod"
import { message } from "./fields"

export const commentSchema = z.object({
    body: message("Comment", { min: 3, max: 1000 }),
    score: z.enum(["1", "2", "3", "4", "5"], { error: "Please select a rating" }),
})
