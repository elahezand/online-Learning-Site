import { createContext, useCallback, useContext, useRef, useState } from "react"
import Modal from "react-bootstrap/Modal"
import { FaCircleCheck, FaCircleExclamation, FaCircleInfo, FaTriangleExclamation } from "react-icons/fa6"

/*
 * App-wide dialogs built on Bootstrap's Modal (theme-aware, accessible).
 *
 *   const dialog = useDialog()
 *   const ok   = await dialog({ title: "Delete this user?", icon: "warning", buttons: ["No", "Yes"] })  // true | null
 *   const text = await dialog({ title: "New title", content: "input", buttons: "Save" })              // string | null
 *   await dialog({ title: "Saved", icon: "success" })                                                 // true
 *
 * The options mirror sweetalert's, so existing calls keep working.
 */

const DialogContext = createContext(null)

const ICONS = {
    success: <FaCircleCheck className="text-success" />,
    error: <FaCircleExclamation className="text-danger" />,
    warning: <FaTriangleExclamation className="text-warning" />,
    info: <FaCircleInfo className="text-info" />,
}

export function DialogProvider({ children }) {
    const [dialog, setDialog] = useState(null)
    const [value, setValue] = useState("")
    const resolver = useRef(null)

    const open = useCallback((options) => new Promise((resolve) => {
        resolver.current = resolve
        setValue("")
        setDialog(typeof options === "string" ? { title: options } : options)
    }), [])

    const close = (result) => {
        resolver.current?.(result)
        resolver.current = null
        setDialog(null)
    }

    const isPrompt = dialog?.content === "input"
    const isConfirm = Array.isArray(dialog?.buttons)
    const [cancelLabel, confirmLabel] = isConfirm
        ? dialog.buttons
        : [isPrompt ? "Cancel" : null, typeof dialog?.buttons === "string" ? dialog.buttons : "OK"]
    const isDanger = dialog?.icon === "warning" && isConfirm

    const confirm = () => close(isPrompt ? value : true)

    return (
        <DialogContext.Provider value={open}>
            {children}
            <Modal show={Boolean(dialog)} onHide={() => close(null)} centered>
                <Modal.Body className="p-4">
                    <div className="d-flex gap-3">
                        {dialog?.icon && <div className="fs-3 lh-1 flex-shrink-0">{ICONS[dialog.icon]}</div>}
                        <div className="flex-grow-1 text-break">
                            <h2 className="h5 fw-bold mb-2">{dialog?.title}</h2>
                            {dialog?.text && <p className="text-body-secondary mb-0">{dialog.text}</p>}
                            {isPrompt &&
                                <form onSubmit={(e) => { e.preventDefault(); confirm() }}>
                                    <textarea className="form-control mt-3" rows={3} autoFocus
                                        aria-label={dialog.title}
                                        value={value} onChange={(e) => setValue(e.target.value)} />
                                </form>}
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer className="border-0 pt-0">
                    {cancelLabel &&
                        <button type="button" className="btn btn-outline-secondary" onClick={() => close(null)}>{cancelLabel}</button>}
                    <button type="button" className={`btn ${isDanger ? "btn-danger" : "btn-primary"}`} onClick={confirm}
                        autoFocus={!isPrompt} disabled={isPrompt && !value.trim()}>
                        {confirmLabel}
                    </button>
                </Modal.Footer>
            </Modal>
        </DialogContext.Provider>
    )
}

export function useDialog() {
    const open = useContext(DialogContext)
    if (!open) throw new Error("useDialog must be used inside <DialogProvider>")
    return open
}
