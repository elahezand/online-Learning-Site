import type { ReactNode } from "react"

interface CartSummaryProps {
    subtotal: number
    savings: number
    total: number
    count: number
    children?: ReactNode
}

export default function CartSummary({ subtotal, savings, total, count, children }: CartSummaryProps) {
    return (
        <section className="card border-0 shadow-sm rounded-4">
            <div className="card-body p-4">
                <h2 className="h5 fw-bold mb-4">Order summary</h2>
                <dl className="d-grid gap-2 mb-0">
                    <div className="d-flex justify-content-between">
                        <dt className="fw-normal text-body-secondary">Courses ({count})</dt>
                        <dd className="mb-0">{subtotal.toLocaleString()} $</dd>
                    </div>
                    <div className="d-flex justify-content-between">
                        <dt className="fw-normal text-body-secondary">Discount</dt>
                        <dd className={`mb-0 ${savings ? "text-success fw-medium" : ""}`}>{savings ? `− ${savings.toLocaleString()} $` : "0 $"}</dd>
                    </div>
                    <hr className="my-2" />
                    <div className="d-flex justify-content-between align-items-baseline">
                        <dt className="fw-bold text-body-emphasis">Total</dt>
                        <dd className="mb-0 fs-4 fw-bold text-body-emphasis">{total === 0 && count ? "Free" : `${total.toLocaleString()} $`}</dd>
                    </div>
                </dl>
                {children}
            </div>
        </section>
    )
}