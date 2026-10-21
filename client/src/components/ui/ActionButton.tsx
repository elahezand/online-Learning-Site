import type { ComponentPropsWithoutRef, ReactNode } from "react"

type Variant = "primary" | "secondary" | "success" | "warning" | "danger"

interface ActionButtonProps extends ComponentPropsWithoutRef<"button"> {
    variant?: Variant
    icon?: ReactNode
}

export default function ActionButton({ variant = "primary", icon, children, className = "", ...props }: ActionButtonProps) {
    return (
        <button type="button" className={`btn btn-sm btn-outline-${variant} d-inline-flex align-items-center gap-1 ${className}`} {...props}>
            {icon}{children}
        </button>
    )
}

export function RowActions({ children }: { children: ReactNode }) {
    return <div className="d-flex justify-content-end gap-1">{children}</div>
}

export function EmptyRow({ colSpan, children = "Nothing here yet." }: { colSpan: number; children?: ReactNode }) {
    return (
        <tr>
            <td colSpan={colSpan} className="text-center text-body-secondary py-4">{children}</td>
        </tr>
    )
}

interface StatusBadgeProps {
    ok: unknown
    okLabel: string
    pendingLabel: string
}

export function StatusBadge({ ok, okLabel, pendingLabel }: StatusBadgeProps) {
    return ok ?
        <span className="badge rounded-pill bg-success-subtle text-success-emphasis">{okLabel}</span> :
        <span className="badge rounded-pill bg-secondary-subtle text-secondary-emphasis">{pendingLabel}</span>
}
