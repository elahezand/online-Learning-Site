import { z } from "zod"
import { image, message, select, slug, text } from "./fields"

const stripHtml = (html) => html.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").trim()

const body = z.string().refine(html => stripHtml(html).length >= 20, "Content must be at least 20 characters")

export const articleSchema = z.object({
    title: text("Title", { min: 3, max: 120 }),
    shortName: slug("Article link"),
    categoryID: select("Category"),
    description: message("Description", { min: 10, max: 300 }),
    body,
    cover: image("Cover"),
})

export const articleDraftSchema = articleSchema.extend({
    cover: image("Cover", { optional: true }),
})
