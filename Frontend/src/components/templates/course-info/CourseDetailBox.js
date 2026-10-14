export default function CourseDetailBox({ title, subtitle, icon }) {
    return (
        <div className="col">
            <div className="surface d-flex align-items-center gap-3 p-3 h-100">
                <span className="icon-badge">
                    <i className={icon}></i>
                </span>
                <div className="d-flex flex-column min-w-0">
                    <span className="small text-body-secondary">{title}</span>
                    <span className="fw-medium text-heading text-truncate">{subtitle || "—"}</span>
                </div>
            </div>
        </div>
    )
}
