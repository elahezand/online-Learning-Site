import { z } from "zod"
import { slug, text } from "./fields"

export const categorySchema = z.object({
    title: text("Title", { min: 2, max: 40 }),
    name: slug("Short name"),
})

export const categoryTitleSchema = text("Title", { min: 2, max: 40 })
