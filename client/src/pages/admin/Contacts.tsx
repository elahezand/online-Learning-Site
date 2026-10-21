import { FaEye, FaReply, FaTrash } from "react-icons/fa6"
import DataTable from "../../components/ui/DataTable"
import Pagination from "../../components/ui/Pagination"
import usePagination from "../../hooks/usePagination"
import ActionButton, { EmptyRow, RowActions, StatusBadge } from "../../components/ui/ActionButton"
import { confirmToast, messageToast, promptToast } from "../../components/ui/toastActions"
import { answerSchema } from "../../validators"
import { useAnswerContact, useContacts, useDeleteContact } from "../../features/contacts/hooks"
import type { Contact } from "../../types/models"

export default function Contacts() {
        const { data: messages = [] } = useContacts()
    const answerContact = useAnswerContact()
    const deleteContact = useDeleteContact()


    const { page, pageCount, start, pageItems: paginatedData } = usePagination(messages)

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
            <DataTable title="Messages">
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
                        {paginatedData.length ? paginatedData.map((contact, index) => (
                            <tr key={contact._id}>
                                <td className="text-body-secondary">{start + index + 1}</td>
                                <td className="fw-medium text-body-emphasis">{contact.name}</td>
                                <td>{contact.email}</td>
                                <td>{contact.phone}</td>
                                <td>{contact.createdAt?.slice(0, 10)}</td>
                                <td><StatusBadge ok={contact.answer} okLabel="Answered" pendingLabel="New" /></td>
                                <td>
                                    <RowActions>
                                        <ActionButton variant="secondary" icon={<FaEye />} onClick={() => messageToast(contact.name, contact.body)}>View</ActionButton>
                                        <ActionButton icon={<FaReply />} onClick={() => answer(contact)}>Answer</ActionButton>
                                        <ActionButton variant="danger" icon={<FaTrash />} onClick={() => remove(contact)}>Remove</ActionButton>
                                    </RowActions>
                                </td>
                            </tr>
                        )) : <EmptyRow colSpan={7}>No messages yet.</EmptyRow>}
                    </tbody>
                </table>
            </DataTable>
            <Pagination page={page} pageCount={pageCount} />
        </>
    )
}
