import { FaTrash } from "react-icons/fa6"
import DataTable from "../../components/ui/DataTable"
import Pagination from "../../components/ui/Pagination"
import usePagination from "../../hooks/usePagination"
import ActionButton, { EmptyRow, RowActions, StatusBadge } from "../../components/ui/ActionButton"
import { confirmToast } from "../../components/ui/toastActions"
import AddSessionForm from "../../features/courses/AddSessionForm"
import { useDeleteSession, useSessions } from "../../features/courses/hooks"

export default function Sessions() {
        const { data: sessions = [] } = useSessions()
    const deleteSession = useDeleteSession()


    const { page, pageCount, start, pageItems: paginatedData } = usePagination(sessions)

    const remove = async (session) => {
        const ok = await confirmToast({ title: `Remove "${session.title}"?`, description: "The session and its video will be deleted.", confirmLabel: "Remove" })
        if (ok) deleteSession.mutate(session._id)
    }

    return (
        <>
            <AddSessionForm />
            <DataTable title="Sessions">
                <table className="table table-hover align-middle text-nowrap mb-0">
                    <thead>
                        <tr>
                            <th className="text-body-secondary">#</th>
                            <th>Title</th>
                            <th>Time</th>
                            <th>Course</th>
                            <th>Access</th>
                            <th>Updated</th>
                            <th className="text-end">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedData.length ? paginatedData.map((session, index) => (
                            <tr key={session._id}>
                                <td className="text-body-secondary">{start + index + 1}</td>
                                <td className="fw-medium text-body-emphasis">{session.title}</td>
                                <td>{session.time}</td>
                                <td>{session.course?.name}</td>
                                <td><StatusBadge ok={session.free} okLabel="Free" pendingLabel="Paid" /></td>
                                <td>{session.updatedAt?.slice(0, 10)}</td>
                                <td>
                                    <RowActions>
                                        <ActionButton variant="danger" icon={<FaTrash />} onClick={() => remove(session)}>Remove</ActionButton>
                                    </RowActions>
                                </td>
                            </tr>
                        )) : <EmptyRow colSpan={7}>No sessions yet.</EmptyRow>}
                    </tbody>
                </table>
            </DataTable>
            <Pagination page={page} pageCount={pageCount} />
        </>
    )
}
