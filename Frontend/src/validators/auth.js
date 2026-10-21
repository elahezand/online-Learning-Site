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
