import { z } from "zod"
import { email, password, phone, text, username } from "./fields"

export const loginSchema = z.object({
    username: text("Username or email", { max: 60 }),
    password: text("Password", { max: 18 }),
})

export const registerSchema = z.object({
    name: text("Full name", { min: 3, max: 40 }),
    username,
    email,
    phonenumber: phone,
    password,
})

export type LoginFormValues = z.input<typeof loginSchema>
export type RegisterFormValues = z.input<typeof registerSchema>
export type LoginData = z.output<typeof loginSchema>
export type RegisterData = z.output<typeof registerSchema>
