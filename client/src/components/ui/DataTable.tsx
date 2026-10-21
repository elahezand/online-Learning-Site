import type { ReactNode } from "react"

interface DataTableProps {
    title?: string
    actions?: ReactNode
    children: ReactNode
}

/* Card wrapper for admin tables. Children should be a
   <table className="table table-hover align-middle mb-0">. */
export default function DataTable({ title, actions, children }: DataTableProps) {
    return (
        <section className="card shadow-sm mt-4 overflow-hidden">
            {(title || actions) &&
                <div className="card-header d-flex flex-wrap align-items-center justify-content-between gap-2 py-3">
                    {title && <h2 className="h5 fw-bold mb-0">{title}</h2>}
                    {actions}
                </div>}
            <div className="table-responsive">
                {children}
            </div>
        </section>
    )
}
