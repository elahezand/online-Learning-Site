import { FaArrowsRotate, FaBan, FaMagnifyingGlass } from "react-icons/fa6"
import DataTable from "../../components/ui/DataTable"
import Pagination from "../../components/ui/Pagination"
import StatusFilter from "../../components/ui/StatusFilter"
import FilterSelect from "../../components/ui/FilterSelect"
import ActionButton, { EmptyRow, RowActions } from "../../components/ui/ActionButton"
import { confirmToast } from "../../components/ui/toastActions"
import useListParams from "../../hooks/useListParams"
import useDebouncedValue from "../../hooks/useDebouncedValue"
import { useAdminOrders, useCancelOrder, useRunOrderSweeps } from "../../features/orders/hooks"
import type { OrderQuery } from "../../features/orders/hooks"
import type { AdminOrder } from "../../types/models"

const PAGE_SIZE = 10

const PAYMENT_OPTIONS = [
    { value: "", label: "All" },
    { value: "pending", label: "Waiting for payment" },
    { value: "paid", label: "Paid" },
    { value: "failed", label: "Failed" },
    { value: "refunded", label: "Refunded" },
]

const STATUS_OPTIONS = [
    { value: "created", label: "Created" },
    { value: "processing", label: "Active" },
    { value: "completed", label: "Completed" },
    { value: "cancelled", label: "Cancelled" },
]

const PAYMENT_BADGES: Record<string, string> = {
    pending: "bg-warning-subtle text-warning-emphasis",
    paid: "bg-success-subtle text-success-emphasis",
    failed: "bg-danger-subtle text-danger-emphasis",
    refunded: "bg-secondary-subtle text-secondary-emphasis",
}

const METHOD_LABELS: Record<string, string> = { zarinpal: "Online", wallet: "Wallet", free: "Free" }

const shortId = (order: AdminOrder) => order._id.slice(-6).toUpperCase()
const amountOf = (order: AdminOrder) => order.pricing.total + order.pricing.walletUsed
const formatAmount = (amount: number) => (amount === 0 ? "Free" : `${amount.toLocaleString()} Toman`)

export default function Orders() {
    const { page, get, update } = useListParams()
    const paymentStatus = get("paymentStatus")
    const status = get("status")
    const search = get("q")
    const debouncedSearch = useDebouncedValue(search.trim())

    const { data, isLoading } = useAdminOrders({
        page,
        limit: PAGE_SIZE,
        paymentStatus: (paymentStatus || undefined) as OrderQuery["paymentStatus"],
        status: (status || undefined) as OrderQuery["status"],
        q: debouncedSearch || undefined,
    })
    const orders = data?.items ?? []
    const isFiltered = Boolean(paymentStatus || status || search)

    const cancelOrderMutation = useCancelOrder()
    const runSweeps = useRunOrderSweeps()

    const cancelOrder = async (order: AdminOrder) => {
        const ok = await confirmToast({
            title: `Cancel order #${shortId(order)}?`,
            description: "The student loses access to these courses and gets the full amount back in their wallet.",
            confirmLabel: "Cancel order",
        })
        if (ok) cancelOrderMutation.mutate({ id: order._id })
    }

    const sweep = async () => {
        const ok = await confirmToast({
            title: "Run order checks now?",
            description: "Finishes paid orders that got stuck and closes unpaid ones older than 30 minutes.",
            confirmLabel: "Run checks",
            variant: "primary",
        })
        if (ok) runSweeps.mutate()
    }

    return (
        <>
            <DataTable title="Orders" actions={
                <div className="d-flex flex-wrap align-items-center gap-2">
                    <div className="input-group input-group-sm w-auto">
                        <span className="input-group-text bg-body"><FaMagnifyingGlass /></span>
                        <input type="search" className="form-control" value={search}
                            onChange={(e) => update({ q: e.target.value })}
                            placeholder="Order number" aria-label="Search orders" />
                    </div>
                    <FilterSelect label="Filter by status" value={status} onChange={(value) => update({ status: value })}
                        options={STATUS_OPTIONS} allLabel="All statuses" />
                    <button type="button" className="btn btn-sm btn-outline-primary d-inline-flex align-items-center gap-2"
                        onClick={sweep} disabled={runSweeps.isPending}>
                        <FaArrowsRotate /> {runSweeps.isPending ? "Checking…" : "Run checks"}
                    </button>
                </div>}>
                <div className="px-3 pt-3">
                    <StatusFilter options={PAYMENT_OPTIONS} value={paymentStatus} label="Filter by payment"
                        onChange={(value) => update({ paymentStatus: value })} />
                </div>
                <table className="table table-hover align-middle text-nowrap mb-0">
                    <thead>
                        <tr>
                            <th className="text-body-secondary">#</th>
                            <th>Order</th>
                            <th>Student</th>
                            <th>Courses</th>
                            <th>Total</th>
                            <th>Payment</th>
                            <th className="text-end">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.length ? orders.map((order, index) => {
                            const [first, ...rest] = order.items
                            const cancelled = order.status === "cancelled"
                            return (
                                <tr key={order._id} className={cancelled ? "text-body-secondary" : ""}>
                                    <td className="text-body-secondary">{index + 1}</td>
                                    <td>
                                        <div className="fw-bold text-body-emphasis">#{shortId(order)}</div>
                                        <div className="small text-body-secondary">{order.createdAt.slice(0, 10)}</div>
                                    </td>
                                    <td>
                                        <div className="fw-medium text-body-emphasis">{order.user?.name ?? "—"}</div>
                                        <div className="small text-body-secondary">{order.user?.phone}</div>
                                    </td>
                                    <td>
                                        <div className="text-truncate" style={{ maxWidth: "16rem" }}>{first?.snapshot.name}</div>
                                        {rest.length > 0 && <div className="small text-body-secondary">+{rest.length} more</div>}
                                    </td>
                                    <td>
                                        <div className="fw-medium">{formatAmount(amountOf(order))}</div>
                                        {order.pricing.walletUsed > 0 &&
                                            <div className="small text-body-secondary">{order.pricing.walletUsed.toLocaleString()} from wallet</div>}
                                    </td>
                                    <td>
                                        <span className={`badge rounded-pill ${PAYMENT_BADGES[order.paymentStatus]}`}>
                                            {PAYMENT_OPTIONS.find(option => option.value === order.paymentStatus)?.label}
                                        </span>
                                        <div className="small text-body-secondary mt-1">
                                            {METHOD_LABELS[order.paymentMethod]}{cancelled ? " · cancelled" : ""}
                                        </div>
                                    </td>
                                    <td>
                                        <RowActions>
                                            {order.paymentStatus === "paid" && !cancelled && order.status !== "completed" &&
                                                <ActionButton variant="danger" icon={<FaBan />} onClick={() => cancelOrder(order)}>Cancel</ActionButton>}
                                        </RowActions>
                                    </td>
                                </tr>
                            )
                        }) : <EmptyRow colSpan={7}>{isLoading ? "Loading…" : isFiltered ? "No orders match this filter." : "No orders yet."}</EmptyRow>}
                    </tbody>
                </table>
            </DataTable>
            <Pagination pagination={data?.pagination} />
        </>
    )
}
