import { z } from "zod"
import { numberField, select, text } from "./fields"

export const discountSchema = z.object({
    code: text("Code", { min: 3, max: 20 }).regex(/^[A-Za-z0-9_-]+$/, "Use only letters, numbers, - and _"),
    percent: numberField("Percent", { min: 1, max: 100 }),
    max: numberField("Max uses", { min: 1, max: 9999 }),
    course: select("Course"),
})

export const siteWideDiscountSchema = z.object({
    percent: numberField("Discount", { min: 1, max: 100 }),
    endsAt: text("End date")
        .refine(value => !Number.isNaN(new Date(value).getTime()), "End date is not valid")
        .refine(value => new Date(value).getTime() > Date.now(), "End date must be in the future")
        .transform(value => new Date(value).toISOString()),
})

export type DiscountFormValues = z.input<typeof discountSchema>
export type SiteWideDiscountFormValues = z.input<typeof siteWideDiscountSchema>
export type DiscountData = z.output<typeof discountSchema>
export type SiteWideDiscountData = z.output<typeof siteWideDiscountSchema>
