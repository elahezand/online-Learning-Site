import { Link } from "react-router-dom"
import { FaChevronRight, FaHeadset, FaPlus } from "react-icons/fa6"
import Pagination from "../../components/ui/Pagination"
import StatusFilter from "../../components/ui/StatusFilter"
import useListParams from "../../hooks/useListParams"
import { useMyTickets } from "../../features/tickets/hooks"
import type { MyTicketsQuery } from "../../features/tickets/hooks"
import { departmentOf, formatDate, hasNewReply, isAnswered } from "../../features/tickets/ticketView"

const STATUS_OPTIONS = [
    { value: "", label: "All" },
    { value: "pending", label: "Waiting" },
    { value: "answered", label: "Answered" },
] as const

const PAGE_SIZE = 10

export default function Tickets() {
    const { page, get, update } = useListParams()
    const status = STATUS_OPTIONS.find(option => option.value === get("status"))?.value ?? ""

    const { data, isLoading } = useMyTickets({
        page,
        limit: PAGE_SIZE,
        status: (status || undefined) as MyTicketsQuery["status"],
    })
    const tickets = data?.items ?? []

    return (
        <>
            <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
                <h2 className="h4 fw-bold mb-0">Tickets</h2>
                <Link className="btn btn-primary d-inline-flex align-items-center gap-2" to="/my-account/add-newTicket">
                    <FaPlus /> New ticket
                </Link>
            </div>

            <div className="mb-3">
                <StatusFilter options={STATUS_OPTIONS} value={status} onChange={(value) => update({ status: value })} />
            </div>

            {isLoading ?
                <div className="text-center py-5"><div className="spinner-border text-primary" role="status"><span className="visually-hidden">Loading…</span></div></div> :
                tickets.length ?
                    <div className="list-group shadow-sm">
                        {tickets.map(ticket => {
                            const unread = hasNewReply(ticket)
                            return (
                                <Link key={ticket._id} to={`/my-account/ticket/${ticket._id}`}
                                    className={`list-group-item list-group-item-action d-flex align-items-center gap-3 py-3 ${unread ? "bg-primary-subtle" : ""}`}>
                                    <span className="d-inline-flex align-items-center justify-content-center rounded-circle bg-primary-subtle text-primary-emphasis fs-5 p-2 lh-1 flex-shrink-0">
                                        <FaHeadset />
                                    </span>
                                    <div className="flex-grow-1 overflow-hidden">
                                        <div className="d-flex align-items-center gap-2">
                                            <span className={`text-truncate text-body-emphasis ${unread ? "fw-bold" : "fw-medium"}`}>{ticket.title}</span>
                                            {unread && <span className="badge rounded-pill text-bg-primary flex-shrink-0">New reply</span>}
                                        </div>
                                        <div className={`small text-truncate ${unread ? "text-body-emphasis" : "text-body-secondary"}`}>{ticket.body}</div>
                                        <div className="small text-body-secondary">{departmentOf(ticket)}</div>
                                    </div>
                                    <div className="d-flex flex-column align-items-end gap-1 flex-shrink-0">
                                        <span className="small text-body-secondary">{formatDate(ticket.updatedAt ?? ticket.createdAt)}</span>
                                        {isAnswered(ticket) ?
                                            <span className="badge rounded-pill bg-success-subtle text-success-emphasis">Answered</span> :
                                            <span className="badge rounded-pill bg-warning-subtle text-warning-emphasis">Waiting</span>}
                                    </div>
                                    <FaChevronRight className="text-body-tertiary d-none d-sm-block flex-shrink-0" />
                                </Link>
                            )
                        })}
                    </div> :
                    <div className="alert alert-primary">
                        {status ? "No tickets here." : "You haven't sent any tickets yet."}
                    </div>}

            <Pagination pagination={data?.pagination} />
        </>
    )
}