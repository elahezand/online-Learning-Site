import { z } from "zod";
import { email, password, phone, text, username } from "./common";

export const registerSchema = z
  .object({
    name: text("Full name", { min: 3, max: 60 }),
    username,
    email,
    phone,
    password,
    confirmPassword: text("Password confirmation", { max: 64 }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  identifier: text("Username or email", { max: 100 }),
  password: text("Password", { max: 64 }),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
