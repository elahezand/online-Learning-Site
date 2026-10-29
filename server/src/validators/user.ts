import { z } from "zod";
import { choice, email, objectId, optional, paginationQuery, password, phone, text, username } from "./common";
const ROLES = ["ADMIN", "USER"] as const;

const role = z.preprocess(
  (value) => (typeof value === "string" ? value.trim().toUpperCase() : value),
  choice("Role", ROLES)
);
export const updateProfileSchema = z.object({
  name: text("Full name", { min: 3, max: 60 }),
  username,
  email,
  phone,
  password: optional(password),
  currentPassword: optional(text("Current password", { max: 64 })),
}).refine((data) => !data.password || data.currentPassword, {
  message: "Enter your current password",
  path: ["currentPassword"],
});

export const editUserSchema = z.object({
  name: optional(text("Full name", { min: 3, max: 60 })),
  username: optional(username),
  email: optional(email),
  phone: optional(phone),
  password: optional(password),
  role: optional(role),
});

export const changeRoleSchema = z.object({
  id: objectId("User id"),
  role,
});

export const myCoursesQuery = paginationQuery.extend({
  status: optional(choice("Status", ["free", "paid", "completed", "in-progress"] as const)),
});

export const userListQuery = paginationQuery.extend({
  search: optional(text("Search", { max: 80 })),
  role: optional(role),
  status: optional(choice("Status", ["active", "banned"] as const)).default("active"),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type EditUserInput = z.infer<typeof editUserSchema>;
export type ChangeRoleInput = z.infer<typeof changeRoleSchema>;
