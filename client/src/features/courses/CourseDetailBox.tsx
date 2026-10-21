import type { ReactNode } from "react"

export default function CourseDetailBox({ title, subtitle, icon }: { title: string; subtitle: ReactNode; icon: ReactNode }) {
    return (
        <div className="col">
            <div className="card h-100 shadow-sm">
                <div className="card-body d-flex align-items-center gap-3 p-3">
                    <span className="d-inline-flex align-items-center justify-content-center rounded-3 bg-primary-subtle text-primary-emphasis p-2 fs-5 lh-1 flex-shrink-0">
                        {icon}
                    </span>
                    <div className="text-truncate">
                        <div className="small text-body-secondary">{title}</div>
                        <div className="fw-medium text-body-emphasis text-truncate">{subtitle || "—"}</div>
                    </div>
                </div>
            </div>
        </div>
    )
}
