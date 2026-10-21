export default function AboutUsBox({ title, desc, icon }) {
    return (
        <div className="col">
            <div className="card h-100 shadow-sm">
                <div className="card-body d-flex align-items-center gap-3">
                    <span className="d-inline-flex align-items-center justify-content-center rounded-3 bg-primary-subtle text-primary-emphasis fs-4 p-3 lh-1 flex-shrink-0">
                        {icon}
                    </span>
                    <div>
                        <h3 className="h6 fw-bold mb-1">{title}</h3>
                        <p className="small text-body-secondary mb-0">{desc}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
