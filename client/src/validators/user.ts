import { z } from "zod"
import { email, password, phone, text, username } from "./fields"

export const userSchema = z.object({
    name: text("Full name", { min: 3, max: 40 }),
    username,
    email,
    phone,
    password,
})

export const profileSchema = z.object({
    name: text("Full name", { min: 3, max: 40 }),
    username,
    email,
    phone,
    password: z.union([z.literal(""), password]),
    confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
})

export const roleSchema = z.string().trim().toUpperCase()
    .pipe(z.enum(["ADMIN", "USER"], { error: "Role must be ADMIN or USER" }))

export type UserFormValues = z.input<typeof userSchema>
export type ProfileFormValues = z.input<typeof profileSchema>
export type UserData = z.output<typeof userSchema>
export type ProfileData = z.output<typeof profileSchema>
