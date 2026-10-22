import type { ReactElement, ReactNode } from "react"
import { toast } from "sonner"
import PromptForm from "./PromptForm"
import type { PromptOptions } from "./PromptForm"
import ToastCard from "./ToastCard"
import type { ToastTone } from "./ToastCard"
import { DIALOG_TOASTER } from "./toastConfig"

/* Shows a card in the dialog toaster and resolves with the user's answer */
const ask = <T,>(render: (finish: (value: T | undefined) => void) => ReactElement) => new Promise<T | undefined>(resolve => {
    let settled = false
    const finish = (value: T | undefined) => {
        if (settled) return
        settled = true
        toast.dismiss(toastId)
        resolve(value)
    }
    const toastId = toast.custom(() => render(finish), {
        toasterId: DIALOG_TOASTER,
        duration: Infinity,
        dismissible: false,
        onDismiss: () => finish(undefined),
    })
})

const ACTIONS = "d-flex flex-column-reverse flex-sm-row justify-content-sm-end gap-2 mt-4"

interface ConfirmOptions {
    title: string
    description?: ReactNode
    confirmLabel?: string
    cancelLabel?: string
    variant?: Exclude<ToastTone, "info">
}

export const confirmToast = ({ title, description, confirmLabel = "Yes", cancelLabel = "Cancel", variant = "danger" }: ConfirmOptions): Promise<boolean> =>
    ask<boolean>(finish => (
        <ToastCard title={title} description={description} tone={variant} onClose={() => finish(false)}>
            <div className={ACTIONS}>
                <button type="button" className="btn btn-outline-secondary px-4" onClick={() => finish(false)}>{cancelLabel}</button>
                <button type="button" className={`btn btn-${variant} px-4`} autoFocus onClick={() => finish(true)}>{confirmLabel}</button>
            </div>
        </ToastCard>
    )).then(Boolean)

export const promptToast = ({ title, description, placeholder, confirmLabel = "Send", cancelLabel = "Cancel", cancelValue = null, schema, multiline = true }: PromptOptions): Promise<string | null> =>
    ask<string | null>(finish => (
        <PromptForm title={title} description={description} placeholder={placeholder} schema={schema}
            confirmLabel={confirmLabel} cancelLabel={cancelLabel} cancelValue={cancelValue} multiline={multiline} finish={finish} />
    )).then(value => (value === undefined ? null : value))

/* Read-only view of a long text (a comment, a contact message …) */
export const messageToast = (title: string, body?: string) =>
    void ask<void>(finish => (
        <ToastCard title={title} tone="info" onClose={() => finish(undefined)}>
            {body &&
                <div className="bg-body-tertiary rounded-3 p-3 mt-3 overflow-auto" style={{ maxHeight: "50vh", whiteSpace: "pre-wrap" }}>
                    {body}
                </div>}
            <div className={ACTIONS}>
                <button type="button" className="btn btn-primary px-4" autoFocus onClick={() => finish(undefined)}>Close</button>
            </div>
        </ToastCard>
    ))
