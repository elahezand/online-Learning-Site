import { useMemo } from "react"
import { Link, useNavigate } from "react-router-dom"
import { FaComments } from "react-icons/fa6"
import DataTable from "../../components/ui/DataTable"
import Pagination from "../../components/ui/Pagination"
import ActionButton, { EmptyRow, RowActions } from "../../components/ui/ActionButton"
import usePagination from "../../hooks/usePagination"
import { useTickets } from "../../features/tickets/hooks"
import StatusFilter from "../../components/ui/StatusFilter"
import useStatusFilter from "../../hooks/useStatusFilter"
import { PRIORITY_CLASSES, PRIORITY_LABELS, departmentOf, formatDate, isAnswered, isTopLevel, labelOf, TICKET_FILTERS } from "../../features/tickets/ticketView"
import type { Ticket } from "../../types/models"

const EMPTY: Ticket[] = []

const byUrgency = (a: Ticket, b: Ticket) =>
    Number(isAnswered(a)) - Number(isAnswered(b)) ||
    (b.priority ?? 0) - (a.priority ?? 0) ||
    (b.createdAt ?? "").localeCompare(a.createdAt ?? "")

export default function Tickets() {
    const navigate = useNavigate()
    const { data = EMPTY } = useTickets()

    const tickets = useMemo(() => data.filter(isTopLevel).sort(byUrgency), [data])
    const { status: filter, setStatus: setFilter, counts, filtered: visible } = useStatusFilter(tickets, TICKET_FILTERS)

    const { page, pageCount, start, pageItems } = usePagination(visible)

    return (
        <>
            <DataTable title="Tickets" actions={<StatusFilter options={TICKET_FILTERS} value={filter} onChange={setFilter} counts={counts} />}>
                <table className="table table-hover align-middle text-nowrap mb-0">
                    <thead>
                        <tr>
                            <th className="text-body-secondary">#</th>
                            <th>Subject</th>
                            <th>User</th>
                            <th>Department</th>
                            <th>Priority</th>
                            <th>Created</th>
                            <th>Status</th>
                            <th className="text-end">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pageItems.length ? pageItems.map((ticket, index) => {
                            const waiting = !isAnswered(ticket)
                            const link = `/p-admin/ticket/${ticket._id}`
                            return (
                                <tr key={ticket._id} className={waiting ? "fw-bold" : ""} style={{ cursor: "pointer" }} onClick={() => navigate(link)}>
                                    <td className="text-body-secondary fw-normal">{start + index + 1}</td>
                                    <td>
                                        <div className="d-flex align-items-center gap-2">
                                            {waiting && <span className="d-inline-block rounded-circle bg-primary flex-shrink-0 p-1" title="Waiting for reply" aria-label="Waiting for reply" />}
                                            <Link to={link} className="link-body-emphasis" onClick={(e) => e.stopPropagation()}>{ticket.title}</Link>
                                        </div>
                                        <div className="small text-body-secondary fw-normal text-truncate" style={{ maxWidth: "22rem" }}>{ticket.body}</div>
                                    </td>
                                    <td>{labelOf(ticket.user) || "—"}</td>
                                    <td className="fw-normal">{departmentOf(ticket) || "—"}</td>
                                    <td>{ticket.priority ?
                                        <span className={`badge rounded-pill ${PRIORITY_CLASSES[ticket.priority]}`}>{PRIORITY_LABELS[ticket.priority]}</span> : "—"}</td>
                                    <td className="fw-normal">{formatDate(ticket.createdAt)}</td>
                                    <td>{waiting ?
                                        <span className="badge rounded-pill text-bg-primary">New</span> :
                                        <span className="badge rounded-pill bg-success-subtle text-success-emphasis">Answered</span>}</td>
                                    <td>
                                        <RowActions>
                                            <ActionButton icon={<FaComments />} onClick={(e) => { e.stopPropagation(); navigate(link) }}>
                                                {waiting ? "Reply" : "Open"}
                                            </ActionButton>
                                        </RowActions>
                                    </td>
                                </tr>
                            )
                        }) : <EmptyRow colSpan={8}>{filter === "open" ? "No tickets are waiting for a reply." : "No tickets yet."}</EmptyRow>}
                    </tbody>
                </table>
            </DataTable>
            <Pagination page={page} pageCount={pageCount} />
        </>
    )
}
