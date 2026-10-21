import { FaEye, FaReply } from "react-icons/fa6"
import DataTable from "../../components/ui/DataTable"
import Pagination from "../../components/ui/Pagination"
import usePagination from "../../hooks/usePagination"
import ActionButton, { EmptyRow, RowActions, StatusBadge } from "../../components/ui/ActionButton"
import { messageToast, promptToast } from "../../components/ui/toastActions"
import { answerSchema } from "../../validators"
import { useAnswerTicket, useTickets } from "../../features/tickets/hooks"

const PRIORITIES = {
    3: <span className="badge rounded-pill bg-danger-subtle text-danger-emphasis">High</span>,
    2: <span className="badge rounded-pill bg-warning-subtle text-warning-emphasis">Medium</span>,
    1: <span className="badge rounded-pill bg-secondary-subtle text-secondary-emphasis">Low</span>,
}

export default function Tickets() {
        const { data: tickets = [] } = useTickets()
    const answerTicket = useAnswerTicket()


    const { page, pageCount, start, pageItems: paginatedData } = usePagination(tickets)

    const answer = async (ticket) => {
        const body = await promptToast({ title: `Answer "${ticket.title}"`, description: ticket.body, placeholder: "Your answer", schema: answerSchema })
        if (body) answerTicket.mutate({ ticketID: ticket._id, body })
    }

    return (
        <>
            <DataTable title="Tickets">
                <table className="table table-hover align-middle text-nowrap mb-0">
                    <thead>
                        <tr>
                            <th className="text-body-secondary">#</th>
                            <th>User</th>
                            <th>Title</th>
                            <th>Course</th>
                            <th>Department</th>
                            <th>Priority</th>
                            <th>Created</th>
                            <th>Status</th>
                            <th className="text-end">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedData.length ? paginatedData.map((ticket, index) => (
                            <tr key={ticket._id}>
                                <td className="text-body-secondary">{start + index + 1}</td>
                                <td>{ticket.user}</td>
                                <td className="fw-medium text-body-emphasis">{ticket.title}</td>
                                <td>{ticket.course ?? "—"}</td>
                                <td>{ticket.departmentID}</td>
                                <td>{PRIORITIES[ticket.priority] ?? "—"}</td>
                                <td>{ticket.createdAt?.slice(0, 10)}</td>
                                <td><StatusBadge ok={ticket.answer} okLabel="Answered" pendingLabel="Open" /></td>
                                <td>
                                    <RowActions>
                                        <ActionButton variant="secondary" icon={<FaEye />} onClick={() => messageToast(ticket.title, ticket.body)}>View</ActionButton>
                                        <ActionButton icon={<FaReply />} onClick={() => answer(ticket)}>Answer</ActionButton>
                                    </RowActions>
                                </td>
                            </tr>
                        )) : <EmptyRow colSpan={9}>No tickets yet.</EmptyRow>}
                    </tbody>
                </table>
            </DataTable>
            <Pagination page={page} pageCount={pageCount} />
        </>
    )
}
