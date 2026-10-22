import type { ReactNode } from "react"

interface AboutUsBoxProps {
    title: string
    desc: string
    icon: ReactNode
}

export default function AboutUsBox({ title, desc, icon }: AboutUsBoxProps) {
    return (
        <div className="col">
            <div className="about-box card card-hover h-100 border-0 shadow-sm rounded-4">
                <div className="card-body p-4">
                    <span className="about-box__icon d-inline-flex align-items-center justify-content-center rounded-3 bg-primary-subtle text-primary-emphasis fs-4 p-3 lh-1 mb-3">
                        {icon}
                    </span>
                    <h3 className="h6 fw-bold text-body-emphasis mb-2">{title}</h3>
                    <p className="small text-body-secondary mb-0">{desc}</p>
                </div>
            </div>
        </div>
    )
}