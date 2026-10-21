import { z } from "zod"
import { message, optionalImage, select, slug, text } from "./fields"

const stripHtml = (html: string) => html.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").trim()

const body = z.string().refine(html => stripHtml(html).length >= 20, "Content must be at least 20 characters")

/* A draft may keep its existing cover, so the cover is optional here… */
export const articleDraftSchema = z.object({
    title: text("Title", { min: 3, max: 120 }),
    shortName: slug("Article link"),
    categoryID: select("Category"),
    description: message("Description", { min: 10, max: 300 }),
    body,
    cover: optionalImage("Cover"),
})

/* …but a new article needs one. Both forms share the same fields. */
export const articleSchema = articleDraftSchema.refine(data => data.cover instanceof File, {
    message: "Cover is required",
    path: ["cover"],
})

export type ArticleFormValues = z.input<typeof articleDraftSchema>
export type ArticleData = z.output<typeof articleDraftSchema>
