import type { ReactNode } from "react"

interface FormCardProps {
    icon: ReactNode
    title: string
    children: ReactNode
}

export default function FormCard({ icon, title, children }: FormCardProps) {
    return (
        <section className="card shadow-sm mb-4">
            <div className="card-body d-grid gap-3 p-3 p-sm-4">
                <div className="d-flex align-items-center gap-2">
                    <span className="d-inline-flex align-items-center justify-content-center rounded-3 bg-primary-subtle text-primary-emphasis p-2 lh-1">{icon}</span>
                    <h2 className="h5 fw-bold mb-0">{title}</h2>
                </div>
                {children}
            </div>
        </section>
    )
}
