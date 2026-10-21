import { z } from "zod"
import { file, image, message, numberField, select, slug, text } from "./fields"

export const courseSchema = z.object({
    name: text("Name", { min: 3, max: 80 }),
    shortName: slug("Course link"),
    price: numberField("Price", { min: 0, max: 1_000_000_000 }),
    support: text("Support", { min: 2, max: 60 }),
    categoryID: select("Category"),
    status: z.enum(["presell", "start"], { error: "Please select a status" }),
    description: message("Description", { min: 10, max: 1000 }),
    cover: image("Cover"),
})

export const sessionSchema = z.object({
    title: text("Title", { min: 3, max: 80 }),
    time: text("Time").regex(/^\d{1,3}:[0-5]\d$/, "Time must look like 12:30"),
    course: select("Course"),
    free: z.enum(["0", "1"], { error: "Please select a status" }),
    video: file("Video", { accept: ["video/"], maxMB: 500 }),
})

export const discountCodeSchema = text("Discount code", { min: 3, max: 20 })

export type CourseFormValues = z.input<typeof courseSchema>
export type SessionFormValues = z.input<typeof sessionSchema>
export type CourseData = z.output<typeof courseSchema>
export type SessionData = z.output<typeof sessionSchema>
