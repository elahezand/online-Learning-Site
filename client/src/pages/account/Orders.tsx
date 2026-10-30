import { Link } from "react-router-dom"
import { FaBagShopping } from "react-icons/fa6"
import Pagination from "../../components/ui/Pagination"
import { confirmToast } from "../../components/ui/toastActions"
import useListParams from "../../hooks/useListParams"
import { useCancelMyOrder, useMyOrders } from "../../features/orders/hooks"
import type { Order } from "../../types/models"

const PAGE_SIZE = 10

const STATUS_VIEW: Record<string, { label: string; className: string }> = {
    pending: { label: "Waiting for payment", className: "bg-warning-subtle text-warning-emphasis" },
    paid: { label: "Paid", className: "bg-success-subtle text-success-emphasis" },
    failed: { label: "Failed", className: "bg-danger-subtle text-danger-emphasis" },
    refunded: { label: "Refunded", className: "bg-secondary-subtle text-secondary-emphasis" },
    cancelled: { label: "Cancelled", className: "bg-secondary-subtle text-secondary-emphasis" },
}

const statusOf = (order: Order) => STATUS_VIEW[order.status === "cancelled" && order.paymentStatus !== "refunded" ? "cancelled" : order.paymentStatus]

const amountOf = (order: Order) => order.pricing.total + order.pricing.walletUsed

const canCancel = (order: Order) => order.status === "created" && order.paymentStatus === "pending"

export default function Orders() {
    const { page } = useListParams()
    const { data, isLoading } = useMyOrders({ page, limit: PAGE_SIZE })
    const orders = data?.items ?? []
    const cancelOrder = useCancelMyOrder()

    const cancel = async (order: Order) => {
        const ok = await confirmToast({ title: "Cancel this order?", description: "Any wallet balance used will be returned.", confirmLabel: "Cancel order" })
        if (ok) cancelOrder.mutate({ id: order._id })
    }

    if (isLoading) {
        return <div className="text-center py-5"><div className="spinner-border text-primary" role="status"><span className="visually-hidden">Loading…</span></div></div>
    }

    return (
        <>
            <h2 className="h4 fw-bold mb-3">Orders</h2>

            {orders.length ?
                <div className="d-grid gap-3">
                    {orders.map(order => {
                        const status = statusOf(order)
                        return (
                            <section key={order._id} className="card shadow-sm">
                                <div className="card-header d-flex flex-wrap align-items-center justify-content-between gap-2 py-3">
                                    <div>
                                        <span className="fw-bold text-body-emphasis">#{order._id.slice(-6).toUpperCase()}</span>
                                        <span className="small text-body-secondary ms-2">{order.createdAt.slice(0, 10)}</span>
                                    </div>
                                    <span className={`badge rounded-pill ${status.className}`}>{status.label}</span>
                                </div>
                                <ul className="list-group list-group-flush">
                                    {order.items.map(item => (
                                        <li key={item._id} className="list-group-item d-flex align-items-center justify-content-between gap-3">
                                            {item.course && !item.cancelledAt ?
                                                <Link to={`/course-info/${item.course.shortName}`} className="link-body-emphasis text-decoration-none text-truncate">{item.snapshot.name}</Link> :
                                                <span className={`text-truncate ${item.cancelledAt ? "text-decoration-line-through text-body-secondary" : ""}`}>{item.snapshot.name}</span>}
                                            <span className="small text-nowrap">{item.finalPrice === 0 ? "Free" : `${item.finalPrice.toLocaleString()} $`}</span>
                                        </li>
                                    ))}
                                </ul>
                                <div className="card-body d-flex flex-wrap align-items-center justify-content-between gap-2">
                                    <div className="small">
                                        <span className="fw-bold text-body-emphasis">Total: {amountOf(order) === 0 ? "Free" : `${amountOf(order).toLocaleString()} $`}</span>
                                        {order.pricing.walletUsed > 0 && <span className="text-body-secondary ms-2">({order.pricing.walletUsed.toLocaleString()} $ from wallet)</span>}
                                        {(order.refundAmount ?? 0) > 0 && <span className="text-success ms-2">{order.refundAmount!.toLocaleString()} $ refunded</span>}
                                    </div>
                                    {canCancel(order) &&
                                        <button type="button" className="btn btn-sm btn-outline-danger" disabled={cancelOrder.isPending} onClick={() => cancel(order)}>
                                            Cancel order
                                        </button>}
                                </div>
                            </section>
                        )
                    })}
                </div> :
                <div className="text-center border rounded-3 bg-body-tertiary py-5 px-3">
                    <span className="d-inline-flex align-items-center justify-content-center rounded-circle bg-primary-subtle text-primary-emphasis fs-3 p-3 lh-1 mb-3"><FaBagShopping /></span>
                    <p className="fw-medium mb-1">No orders yet</p>
                    <p className="small text-body-secondary mb-3">Courses you buy will show up here.</p>
                    <Link to="/courses" className="btn btn-primary btn-sm">Browse courses</Link>
                </div>}

            <Pagination pagination={data?.pagination} />
        </>
    )
}
