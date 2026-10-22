import { useState } from "react"
import type { FormEvent, ReactNode } from "react"
import type { ZodType } from "zod"
import ToastCard from "./ToastCard"

export interface PromptOptions {
    title: string
    description?: ReactNode
    placeholder?: string
    confirmLabel?: string
    cancelLabel?: string
    cancelValue?: string | null
    schema?: ZodType<string, string>
    multiline?: boolean
}

interface PromptFormProps extends Required<Pick<PromptOptions, "confirmLabel" | "cancelLabel" | "multiline">>, Omit<PromptOptions, "confirmLabel" | "cancelLabel" | "multiline"> {
    finish: (value: string | null | undefined) => void
}

export default function PromptForm({ title, description, placeholder, confirmLabel, cancelLabel, cancelValue = null, schema, multiline, finish }: PromptFormProps) {
    const [value, setValue] = useState("")
    const [error, setError] = useState("")

    const submit = (e: FormEvent) => {
        e.preventDefault()
        if (!schema) {
            if (!value.trim()) return setError("This field is required")
            return finish(value.trim())
        }
        const result = schema.safeParse(value)
        if (!result.success) return setError(result.error.issues[0].message)
        if (!result.data) return setError("This field is required")
        finish(result.data)
    }

    return (
        <ToastCard title={title} description={description} icon="edit" onClose={() => finish(null)}>
            <form className="mt-4" onSubmit={submit} noValidate>
                {multiline ?
                    <textarea className={`form-control ${error ? "is-invalid" : ""}`} rows={4} autoFocus
                        placeholder={placeholder} aria-label={title}
                        value={value} onChange={(e) => { setValue(e.target.value); setError("") }} /> :
                    <input className={`form-control ${error ? "is-invalid" : ""}`} autoFocus
                        placeholder={placeholder} aria-label={title}
                        value={value} onChange={(e) => { setValue(e.target.value); setError("") }} />}
                {error && <div className="invalid-feedback">{error}</div>}
                <div className="d-flex flex-column-reverse flex-sm-row justify-content-sm-end gap-2 mt-4">
                    <button type="button" className="btn btn-outline-secondary px-4" onClick={() => finish(cancelValue)}>{cancelLabel}</button>
                    <button type="submit" className="btn btn-primary px-4">{confirmLabel}</button>
                </div>
            </form>
        </ToastCard>
    )
}
