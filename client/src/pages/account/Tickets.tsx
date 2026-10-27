import { useMemo } from "react"
import { Link } from "react-router-dom"
import { FaChevronRight, FaHeadset, FaPlus } from "react-icons/fa6"
import Pagination from "../../components/ui/Pagination"
import usePagination from "../../hooks/useListParams"
import { useMyTickets } from "../../features/tickets/hooks"
import StatusFilter from "../../components/ui/StatusFilter"
import useStatusFilter from "../../hooks/useStatusFilter"
import { departmentOf, formatDate, hasNewReply, isAnswered, isTopLevel, TICKET_FILTERS } from "../../features/tickets/ticketView"
import type { Ticket } from "../../types/models"

const EMPTY: Ticket[] = []

const byActivity = (a: Ticket, b: Ticket) =>
    Number(hasNewReply(b)) - Number(hasNewReply(a)) ||
    (b.updatedAt ?? b.createdAt ?? "").localeCompare(a.updatedAt ?? a.createdAt ?? "")

export default function Tickets() {
    const { data = EMPTY, isLoading } = useMyTickets()

    const tickets = useMemo(() => data.filter(isTopLevel).sort(byActivity), [data])
    const { status: filter, setStatus: setFilter, counts, filtered: visible } = useStatusFilter(tickets, TICKET_FILTERS)

    const { page, pageCount, pageItems } = usePagination(visible)

    return (
        <>
            <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
                <h2 className="h4 fw-bold mb-0">Tickets</h2>
                <Link className="btn btn-primary d-inline-flex align-items-center gap-2" to="/my-account/add-newTicket">
                    <FaPlus /> New ticket
                </Link>
            </div>

            <div className="mb-3">
                <StatusFilter options={TICKET_FILTERS} value={filter} onChange={setFilter} counts={counts} />
            </div>

            {isLoading ?
                <div className="text-center py-5"><div className="spinner-border text-primary" role="status"><span className="visually-hidden">Loading…</span></div></div> :
                pageItems.length ?
                    <div className="list-group shadow-sm">
                        {pageItems.map(ticket => {
                            const unread = hasNewReply(ticket)
                            return (
                                <Link key={ticket._id} to={`/my-account/ticket/${ticket._id}`}
                                    className={`list-group-item list-group-item-action d-flex align-items-center gap-3 py-3 ${unread ? "bg-primary-subtle" : ""}`}>
                                    <span className="d-inline-flex align-items-center justify-content-center rounded-circle bg-primary-subtle text-primary-emphasis fs-5 p-2 lh-1 flex-shrink-0">
                                        <FaHeadset />
                                    </span>
                                    <div className="flex-grow-1 overflow-hidden">
                                        <div className="d-flex align-items-center gap-2">
                                            <span className={`text-truncate ${unread ? "fw-bold text-body-emphasis" : "fw-medium text-body-emphasis"}`}>{ticket.title}</span>
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
                        {filter === "all" ? "You haven't sent any tickets yet." : "No tickets here."}
                    </div>}

            <Pagination page={page} pageCount={pageCount} />
        </>
    )
}
