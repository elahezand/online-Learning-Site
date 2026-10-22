import { z } from "zod"

interface Length { min?: number; max?: number }

export const text = (label: string, { min = 1, max = 255 }: Length = {}) =>
    z.string()
        .trim()
        .min(1, `${label} is required`)
        .min(min, `${label} must be at least ${min} characters`)
        .max(max, `${label} must be at most ${max} characters`)

export const optionalText = (label: string, { max = 255 }: Length = {}) =>
    z.string().trim().max(max, `${label} must be at most ${max} characters`).optional().or(z.literal(""))

export const email = text("Email", { max: 60 }).pipe(z.email("Enter a valid email address"))

export const phone = text("Phone number").regex(/^09\d{9}$/, "Enter a valid phone number, e.g. 09121234567")

export const password = text("Password", { min: 8, max: 18 })

export const username = text("Username", { min: 3, max: 20 })
    .regex(/^[a-zA-Z0-9_.]+$/, "Use only letters, numbers, . and _")

export const slug = (label = "Link") =>
    text(label, { min: 2, max: 60 })
        .regex(/^[a-z0-9-]+$/, `${label} can only contain lowercase letters, numbers and -`)

export const choice = <const T extends readonly [string, ...string[]]>(values: T, error: string) =>
    z.string().refine((value): value is T[number] => values.includes(value), error)

export const select = (label: string) =>
    z.string().refine(value => Boolean(value) && value !== "-1", `Please select a ${label.toLowerCase()}`)

export const numberField = (label: string, { min = 0, max = Number.MAX_SAFE_INTEGER, integer = true }: { min?: number; max?: number; integer?: boolean } = {}) =>
    z.union([z.string(), z.number()])
        .transform(value => String(value).trim())
        .refine(value => value !== "", `${label} is required`)
        .transform(Number)
        .refine(value => !Number.isNaN(value), `${label} must be a number`)
        .refine(value => !integer || Number.isInteger(value), `${label} must be a whole number`)
        .refine(value => value >= min, `${label} must be at least ${min}`)
        .refine(value => value <= max, `${label} must be at most ${max}`)

const firstFile = (value: unknown) =>
    typeof FileList !== "undefined" && value instanceof FileList ? value[0] ?? "" : value

interface FileOptions { accept?: string[]; maxMB?: number }

const fileSchema = (label: string, { accept = [], maxMB = 5 }: FileOptions) =>
    z.instanceof(File, { message: `${label} is required` })
        .refine(f => !accept.length || accept.some(type => f.type.startsWith(type)), `${label} has an invalid file type`)
        .refine(f => f.size <= maxMB * 1024 * 1024, `${label} must be smaller than ${maxMB} MB`)

export const file = (label: string, options: FileOptions = {}) =>
    z.preprocess(firstFile, fileSchema(label, options))

export const optionalFile = (label: string, options: FileOptions = {}) =>
    z.preprocess(firstFile, fileSchema(label, options).optional().or(z.literal("")))

export const image = (label = "Cover", options?: FileOptions) => file(label, { accept: ["image/"], ...options })

export const optionalImage = (label = "Cover", options?: FileOptions) => optionalFile(label, { accept: ["image/"], ...options })

export const message = (label = "Message", { min = 2, max = 1000 }: Length = {}) => text(label, { min, max })
