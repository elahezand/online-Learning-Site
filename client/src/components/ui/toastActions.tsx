import type { ReactElement, ReactNode } from "react"
import { toast } from "sonner"
import PromptForm from "./PromptForm"
import type { PromptOptions } from "./PromptForm"
import ToastCard from "./ToastCard"

const ask = <T,>(render: (finish: (value: T | undefined) => void) => ReactElement) => new Promise<T | undefined>(resolve => {
    let settled = false
    const finish = (value: T | undefined) => {
        if (settled) return
        settled = true
        toast.dismiss(toastId)
        resolve(value)
    }
    const toastId = toast.custom(() => render(finish), { duration: Infinity, onDismiss: () => finish(undefined) })
})

interface ConfirmOptions {
    title: string
    description?: ReactNode
    confirmLabel?: string
    cancelLabel?: string
    variant?: "danger" | "primary" | "success" | "warning"
}

export const confirmToast = ({ title, description, confirmLabel = "Yes", cancelLabel = "Cancel", variant = "danger" }: ConfirmOptions): Promise<boolean> =>
    ask<boolean>(finish => (
        <ToastCard title={title} description={description}>
            <div className="d-flex justify-content-end gap-2 mt-3">
                <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => finish(false)}>{cancelLabel}</button>
                <button type="button" className={`btn btn-sm btn-${variant}`} autoFocus onClick={() => finish(true)}>{confirmLabel}</button>
            </div>
        </ToastCard>
    )).then(Boolean)

export const promptToast = ({ title, description, placeholder, confirmLabel = "Send", cancelLabel = "Cancel", cancelValue = null, schema, multiline = true }: PromptOptions): Promise<string | null> =>
    ask<string | null>(finish => (
        <PromptForm title={title} description={description} placeholder={placeholder} schema={schema}
            confirmLabel={confirmLabel} cancelLabel={cancelLabel} cancelValue={cancelValue} multiline={multiline} finish={finish} />
    )).then(value => (value === undefined ? null : value))

export const messageToast = (title: string, body?: string) =>
    toast(title, { description: body, duration: 15000, closeButton: true })
