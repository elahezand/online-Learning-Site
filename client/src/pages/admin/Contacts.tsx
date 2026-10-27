import { useMemo } from "react"
import { FaEye, FaReply, FaTrash } from "react-icons/fa6"
import DataTable from "../../components/ui/DataTable"
import Pagination from "../../components/ui/Pagination"
import usePagination from "../../hooks/useListParams"
import useStatusFilter, { ALL, type StatusOption } from "../../hooks/useStatusFilter"
import StatusFilter from "../../components/ui/StatusFilter"
import { formatDate } from "../../features/tickets/ticketView"
import ActionButton, { EmptyRow, RowActions, StatusBadge } from "../../components/ui/ActionButton"
import { confirmToast, messageToast, promptToast } from "../../components/ui/toastActions"
import { answerSchema } from "../../validators"
import { useAnswerContact, useContacts, useDeleteContact } from "../../features/contacts/hooks"
import type { Contact } from "../../types/models"

const EMPTY: Contact[] = []
const isAnswered = (contact: Contact) => Number(contact.answer) === 1

const FILTERS: readonly StatusOption<Contact>[] = [
    ALL,
    { value: "new", label: "Waiting for reply", test: contact => !isAnswered(contact) },
    { value: "answered", label: "Answered", test: isAnswered },
]

const byReply = (a: Contact, b: Contact) =>
    Number(isAnswered(a)) - Number(isAnswered(b)) ||
    (b.createdAt ?? "").localeCompare(a.createdAt ?? "")

export default function Contacts() {
    const { data = EMPTY } = useContacts()
    const messages = useMemo(() => [...data].sort(byReply), [data])
    const { status, setStatus, counts, filtered } = useStatusFilter(messages, FILTERS)
    const answerContact = useAnswerContact()
    const deleteContact = useDeleteContact()

    const { page, pageCount, start, pageItems: paginatedData } = usePagination(filtered)

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
            <DataTable title="Messages" actions={<StatusFilter options={FILTERS} value={status} onChange={setStatus} counts={counts} />}>
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
                        {paginatedData.length ? paginatedData.map((contact, index) => {
                            const waiting = !isAnswered(contact)
                            return (
                                <tr key={contact._id} className={waiting ? "fw-bold" : ""}>
                                    <td className="text-body-secondary fw-normal">{start + index + 1}</td>
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
                        }) : <EmptyRow colSpan={7}>{status === "new" ? "No messages are waiting for a reply." : "No messages yet."}</EmptyRow>}
                    </tbody>
                </table>
            </DataTable>
            <Pagination page={page} pageCount={pageCount} />
        </>
    )
}
