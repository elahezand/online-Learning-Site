import { Link, useNavigate } from "react-router-dom"
import { FaComments } from "react-icons/fa6"
import DataTable from "../../components/ui/DataTable"
import Pagination from "../../components/ui/Pagination"
import StatusFilter from "../../components/ui/StatusFilter"
import ActionButton, { EmptyRow, RowActions } from "../../components/ui/ActionButton"
import useListParams from "../../hooks/useListParams"
import { useTickets } from "../../features/tickets/hooks"
import type { TicketQuery } from "../../features/tickets/hooks"
import { PRIORITY_CLASSES, PRIORITY_LABELS, departmentOf, formatDate, isAnswered, labelOf } from "../../features/tickets/ticketView"

const PAGE_SIZE = 10

const STATUS_OPTIONS = [
    { value: "all", label: "All" },
    { value: "open", label: "Waiting for reply" },
    { value: "answered", label: "Answered" },
]

export default function Tickets() {
    const navigate = useNavigate()
    const { page, get, update } = useListParams()
    const status = get("status") || "all"

    const { data, isLoading } = useTickets({
        page,
        limit: PAGE_SIZE,
        status: status === "all" ? undefined : status as TicketQuery["status"],
    })
    const tickets = data?.items ?? []

    return (
        <>
            <DataTable title="Tickets" actions={
                <StatusFilter options={STATUS_OPTIONS} value={status}
                    onChange={(value) => update({ status: value === "all" ? "" : value })} />}>
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
                        {tickets.length ? tickets.map((ticket, index) => {
                            const waiting = !isAnswered(ticket)
                            const link = `/p-admin/ticket/${ticket._id}`
                            return (
                                <tr key={ticket._id} className={waiting ? "fw-bold" : ""} style={{ cursor: "pointer" }} onClick={() => navigate(link)}>
                                    <td className="text-body-secondary fw-normal">{index + 1}</td>
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
                        }) : <EmptyRow colSpan={8}>{isLoading ? "Loading…" : status === "open" ? "No tickets are waiting for a reply." : "No tickets yet."}</EmptyRow>}
                    </tbody>
                </table>
            </DataTable>
            <Pagination pagination={data?.pagination} />
        </>
    )
}