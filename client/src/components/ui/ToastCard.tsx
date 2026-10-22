import { useEffect, useId } from "react"
import type { ReactNode } from "react"
import {
    FaCircleCheck, FaCircleExclamation, FaCircleInfo, FaCircleQuestion, FaPenToSquare, FaTriangleExclamation,
} from "react-icons/fa6"

export type ToastTone = "danger" | "primary" | "success" | "warning" | "info"

const ICONS: Record<ToastTone, ReactNode> = {
    danger: <FaTriangleExclamation />,
    warning: <FaCircleExclamation />,
    success: <FaCircleCheck />,
    primary: <FaCircleQuestion />,
    info: <FaCircleInfo />,
}

interface ToastCardProps {
    title: string
    description?: ReactNode
    tone?: ToastTone
    /** "edit" shows a pen instead of the tone's icon (used by prompts) */
    icon?: "edit"
    /** Called by the close button and the Escape key */
    onClose?: () => void
    children?: ReactNode
}

/* The dialog-style card shown in the middle of the page by confirmToast, promptToast and messageToast */
export default function ToastCard({ title, description, tone = "primary", icon, onClose, children }: ToastCardProps) {
    const titleId = useId()

    useEffect(() => {
        if (!onClose) return
        const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose() }
        window.addEventListener("keydown", onKey)
        return () => window.removeEventListener("keydown", onKey)
    }, [onClose])

    return (
        <div className="card border-0 shadow-lg rounded-4 w-100" role="alertdialog" aria-modal="true" aria-labelledby={titleId}>
            <div className="card-body p-4">
                <div className="d-flex align-items-start gap-3">
                    <span className={`d-inline-flex align-items-center justify-content-center rounded-circle flex-shrink-0 fs-4 p-2 lh-1 bg-${tone}-subtle text-${tone}-emphasis`}
                        aria-hidden="true">
                        {icon === "edit" ? <FaPenToSquare /> : ICONS[tone]}
                    </span>
                    <div className="flex-grow-1 text-break pt-1" style={{ minWidth: 0 }}>
                        <h2 id={titleId} className="h5 fw-bold text-body-emphasis mb-1">{title}</h2>
                        {description && <div className="text-body-secondary">{description}</div>}
                    </div>
                    {onClose && <button type="button" className="btn-close flex-shrink-0" aria-label="Close" onClick={onClose} />}
                </div>
                {children}
            </div>
        </div>
    )
}
