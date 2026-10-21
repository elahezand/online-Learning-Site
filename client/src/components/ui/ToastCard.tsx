import type { ReactNode } from "react"

interface ToastCardProps {
    title: string
    description?: ReactNode
    onClose?: () => void
    children?: ReactNode
}

export default function ToastCard({ title, description, onClose, children }: ToastCardProps) {
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
