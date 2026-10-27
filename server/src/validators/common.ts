import { z } from "zod";

interface Length {
  min?: number;
  max?: number;
}

interface NumberRange extends Length {
  integer?: boolean;
}

export interface UploadedFile {
  filename: string;
  mimetype: string;
  size: number;
}

const OBJECT_ID = /^[0-9a-fA-F]{24}$/;
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const PHONE = /^09\d{9}$/;

const isBlank = (value: unknown) => value === undefined || value === null || value === "";

export const text = (label: string, { min = 1, max = 255 }: Length = {}) =>
  z
    .string({ error: `${label} is required` })
    .trim()
    .min(1, { error: `${label} is required`, abort: true })
    .min(min, { error: `${label} must be at least ${min} characters`, abort: true })
    .max(max, `${label} must be at most ${max} characters`);

export const optional = <T extends z.ZodType>(schema: T) =>
  z.preprocess((value) => (isBlank(value) ? undefined : value), schema.optional());

export const objectId = (label = "Id") => text(label, { max: 24 }).regex(OBJECT_ID, `${label} is not valid`);

export const slug = (label = "Short name") =>
  text(label, { min: 2, max: 80 })
    .toLowerCase()
    .regex(SLUG, `${label} can only contain lowercase letters, numbers and single dashes`);

export const email = text("Email", { max: 100 }).toLowerCase().pipe(z.email("Email is not valid"));

export const phone = text("Phone number", { max: 11 }).regex(PHONE, "Phone number must look like 09121234567");

export const password = text("Password", { min: 8, max: 64 });

export const username = text("Username", { min: 3, max: 30 }).regex(
  /^[a-zA-Z0-9_.]+$/,
  "Username can only contain letters, numbers, . and _"
);

export const number = (label: string, { min, max, integer = true }: NumberRange = {}) => {
  let schema = z.number({
    error: (issue) => (issue.input === undefined ? `${label} is required` : `${label} must be a number`),
  });
  if (integer) schema = schema.int(`${label} must be a whole number`);
  if (min !== undefined) schema = schema.min(min, `${label} must be at least ${min}`);
  if (max !== undefined) schema = schema.max(max, `${label} must be at most ${max}`);
  return z.preprocess((value) => {
    if (isBlank(value)) return undefined;
    return typeof value === "string" ? Number(value.trim()) : value;
  }, schema);
};

export const flag = (label: string) =>
  z.preprocess(
    (value) => (typeof value === "string" ? Number(value.trim()) : value),
    z.union([z.literal(0), z.literal(1)], { error: `${label} must be 0 or 1` })
  );

export const choice = <const T extends readonly [string, ...string[]]>(label: string, values: T) =>
  z.enum(values, { error: `${label} must be one of: ${values.join(", ")}` });

export const file = (label: string) =>
  z.custom<UploadedFile>(
    (value) => typeof value === "object" && value !== null && "filename" in value,
    { error: `${label} is required` }
  );

export const idParams = (label = "Id") => z.object({ id: objectId(label) });

export const paginationQuery = z.object({
  page: optional(number("Page", { min: 1 })).default(1),
  limit: optional(number("Limit", { min: 1, max: 50 })).default(10),
});

export const sortChoice = <const T extends readonly [string, ...string[]]>(values: T) =>
  optional(choice("Sort", values)).default(values[0]);
