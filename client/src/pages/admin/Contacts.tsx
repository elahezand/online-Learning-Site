import { FaEye, FaReply, FaTrash } from "react-icons/fa6"
import DataTable from "../../components/ui/DataTable"
import Pagination from "../../components/ui/Pagination"
import StatusFilter from "../../components/ui/StatusFilter"
import useListParams from "../../hooks/useListParams"
import { formatDate } from "../../features/tickets/ticketView"
import ActionButton, { EmptyRow, RowActions, StatusBadge } from "../../components/ui/ActionButton"
import { confirmToast, messageToast, promptToast } from "../../components/ui/toastActions"
import { answerSchema } from "../../validators"
import { useAnswerContact, useContacts, useDeleteContact } from "../../features/contacts/hooks"
import type { ContactQuery } from "../../features/contacts/hooks"
import type { Contact } from "../../types/models"

const PAGE_SIZE = 10

const STATUS_OPTIONS = [
    { value: "all", label: "All" },
    { value: "new", label: "Waiting for reply" },
    { value: "answered", label: "Answered" },
]

const isAnswered = (contact: Contact) => Number(contact.answer) === 1

export default function Contacts() {
    const { page, get, update } = useListParams()
    const status = get("status") || "all"

    const { data, isLoading } = useContacts({
        page,
        limit: PAGE_SIZE,
        status: status === "all" ? undefined : status as ContactQuery["status"],
    })
    const messages = data?.items ?? []

    const answerContact = useAnswerContact()
    const deleteContact = useDeleteContact()

    const answer = async (contact: Contact) => {
        const body = await promptToast({ title: `Answer ${contact.name}`, description: contact.body, placeholder: "Your answer (sent by email)", schema: answerSchema })
        if (body) answerContact.mutate({ email: contact.email, answer: body })
    }

    const remove = async (contact: Contact) => {
        const ok = await confirmToast({ title: `Remove the message from ${contact.name}?`, confirmLabel: "Remove" })
        if (ok) deleteContact.mutate(contact._id)
    }

    return (
        <>
            <DataTable title="Messages" actions={
                <StatusFilter options={STATUS_OPTIONS} value={status}
                    onChange={(value) => update({ status: value === "all" ? "" : value })} />}>
                <table className="table table-hover align-middle text-nowrap mb-0">
                    <thead>
                        <tr>
                            <th className="text-body-secondary">#</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Received</th>
                            <th>Status</th>
                            <th className="text-end">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {messages.length ? messages.map((contact, index) => {
                            const waiting = !isAnswered(contact)
                            return (
                                <tr key={contact._id} className={waiting ? "fw-bold" : ""}>
                                    <td className="text-body-secondary fw-normal">{index + 1}</td>
                                    <td>
                                        <div className="d-flex align-items-center gap-2 text-body-emphasis">
                                            {waiting && <span className="d-inline-block rounded-circle bg-primary flex-shrink-0 p-1" title="Waiting for reply" aria-label="Waiting for reply" />}
                                            {contact.name}
                                        </div>
                                        <div className="small text-body-secondary fw-normal text-truncate" style={{ maxWidth: "22rem" }}>{contact.body}</div>
                                    </td>
                                    <td className="fw-normal">{contact.email}</td>
                                    <td className="fw-normal">{contact.phone}</td>
                                    <td className="fw-normal">{formatDate(contact.createdAt)}</td>
                                    <td><StatusBadge ok={contact.answer} okLabel="Answered" pendingLabel="New" /></td>
                                    <td>
                                        <RowActions>
                                            <ActionButton variant="secondary" icon={<FaEye />} onClick={() => messageToast(contact.name, contact.body)}>View</ActionButton>
                                            <ActionButton icon={<FaReply />} onClick={() => answer(contact)}>Answer</ActionButton>
                                            <ActionButton variant="danger" icon={<FaTrash />} onClick={() => remove(contact)}>Remove</ActionButton>
                                        </RowActions>
                                    </td>
                                </tr>
                            )
                        }) : <EmptyRow colSpan={7}>{isLoading ? "Loading…" : status === "new" ? "No messages are waiting for a reply." : "No messages yet."}</EmptyRow>}
                    </tbody>
                </table>
            </DataTable>
            <Pagination pagination={data?.pagination} />
        </>
    )
}