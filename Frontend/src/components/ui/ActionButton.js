export default function ActionButton({ variant = "primary", icon, children, className = "", ...props }) {
    return (
        <button type="button" className={`btn btn-sm btn-outline-${variant} d-inline-flex align-items-center gap-1 ${className}`} {...props}>
            {icon}{children}
        </button>
    )
}

export function RowActions({ children }) {
    return <div className="d-flex justify-content-end gap-1">{children}</div>
}

export function EmptyRow({ colSpan, children = "Nothing here yet." }) {
    return (
        <tr>
            <td colSpan={colSpan} className="text-center text-body-secondary py-4">{children}</td>
        </tr>
    )
}

export function StatusBadge({ ok, okLabel, pendingLabel }) {
    return ok ?
        <span className="badge rounded-pill bg-success-subtle text-success-emphasis">{okLabel}</span> :
        <span className="badge rounded-pill bg-secondary-subtle text-secondary-emphasis">{pendingLabel}</span>
}
