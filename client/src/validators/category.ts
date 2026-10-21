import { z } from "zod"
import { slug, text } from "./fields"

export const categorySchema = z.object({
    title: text("Title", { min: 2, max: 40 }),
    name: slug("Short name"),
})

export const categoryTitleSchema = text("Title", { min: 2, max: 40 })

export type CategoryFormValues = z.input<typeof categorySchema>
export type CategoryData = z.output<typeof categorySchema>
