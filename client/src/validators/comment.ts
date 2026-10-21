import { z } from "zod"
import { choice, message } from "./fields"

export const commentSchema = z.object({
    body: message("Comment", { min: 3, max: 1000 }),
    score: choice(["1", "2", "3", "4", "5"], "Please select a rating"),
})

export type CommentFormValues = z.input<typeof commentSchema>
export type CommentData = z.output<typeof commentSchema>
