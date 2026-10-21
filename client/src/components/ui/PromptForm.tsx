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
    /** What the Cancel button returns. Closing the toast always returns null. */
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
        <ToastCard title={title} description={description} onClose={() => finish(null)}>
            <form className="mt-3" onSubmit={submit} noValidate>
                {multiline ?
                    <textarea className={`form-control form-control-sm ${error ? "is-invalid" : ""}`} rows={3} autoFocus
                        placeholder={placeholder} aria-label={title}
                        value={value} onChange={(e) => { setValue(e.target.value); setError("") }} /> :
                    <input className={`form-control form-control-sm ${error ? "is-invalid" : ""}`} autoFocus
                        placeholder={placeholder} aria-label={title}
                        value={value} onChange={(e) => { setValue(e.target.value); setError("") }} />}
                {error && <div className="invalid-feedback">{error}</div>}
                <div className="d-flex justify-content-end gap-2 mt-2">
                    <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => finish(cancelValue)}>{cancelLabel}</button>
                    <button type="submit" className="btn btn-sm btn-primary">{confirmLabel}</button>
                </div>
            </form>
        </ToastCard>
    )
}
