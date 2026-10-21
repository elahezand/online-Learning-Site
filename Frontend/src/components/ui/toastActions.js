import { useState } from "react"
import { toast } from "sonner"

function ToastCard({ title, description, onClose, children }) {
    return (
        <div className="card shadow w-100" role="alertdialog" aria-label={title}>
            <div className="card-body p-3">
                <div className="d-flex align-items-start gap-2">
                    <div className="flex-grow-1 text-break">
                        <div className="fw-bold text-body-emphasis">{title}</div>
                        {description && <div className="small text-body-secondary mt-1">{description}</div>}
                    </div>
                    {onClose && <button type="button" className="btn-close btn-sm" aria-label="Close" onClick={onClose} />}
                </div>
                {children}
            </div>
        </div>
    )
}

const ask = (render) => new Promise(resolve => {
    let settled = false
    let toastId
    const finish = (value) => {
        if (settled) return
        settled = true
        toast.dismiss(toastId)
        resolve(value)
    }
    toastId = toast.custom(() => render(finish), { duration: Infinity, onDismiss: () => finish(undefined) })
})

export const confirmToast = ({ title, description, confirmLabel = "Yes", cancelLabel = "Cancel", variant = "danger" }) =>
    ask(finish => (
        <ToastCard title={title} description={description}>
            <div className="d-flex justify-content-end gap-2 mt-3">
                <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => finish(false)}>{cancelLabel}</button>
                <button type="button" className={`btn btn-sm btn-${variant}`} autoFocus onClick={() => finish(true)}>{confirmLabel}</button>
            </div>
        </ToastCard>
    )).then(Boolean)

function PromptForm({ title, description, placeholder, confirmLabel, cancelLabel, cancelValue, schema, multiline, finish }) {
    const [value, setValue] = useState("")
    const [error, setError] = useState("")

    const submit = (e) => {
        e.preventDefault()
        const result = schema ? schema.safeParse(value) : { success: true, data: value.trim() }
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

export const promptToast = ({ title, description, placeholder, confirmLabel = "Send", cancelLabel = "Cancel", cancelValue = null, schema, multiline = true }) =>
    ask(finish => (
        <PromptForm title={title} description={description} placeholder={placeholder} schema={schema}
            confirmLabel={confirmLabel} cancelLabel={cancelLabel} cancelValue={cancelValue} multiline={multiline} finish={finish} />
    )).then(value => (value === undefined ? null : value))

export const messageToast = (title, body) =>
    toast(title, { description: body, duration: 15000, closeButton: true })
