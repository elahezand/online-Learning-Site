import { z } from "zod"
import { text } from "./fields"

export const menuSchema = z.object({
    title: text("Title", { min: 2, max: 30 }),
    href: text("Link", { max: 120 }).regex(/^(\/|https?:\/\/)/, "Link must start with / or http"),
    parent: z.string().optional(),
})

export type MenuFormValues = z.input<typeof menuSchema>
export type MenuData = z.output<typeof menuSchema>
