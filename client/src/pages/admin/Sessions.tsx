import { FaTrash } from "react-icons/fa6"
import DataTable from "../../components/ui/DataTable"
import Pagination from "../../components/ui/Pagination"
import FilterSelect from "../../components/ui/FilterSelect"
import SearchSelect from "../../components/ui/SearchSelect"
import ActionButton, { EmptyRow, RowActions, StatusBadge } from "../../components/ui/ActionButton"
import { confirmToast } from "../../components/ui/toastActions"
import useListParams from "../../hooks/useListParams"
import AddSessionForm from "../../features/courses/AddSessionForm"
import { useCourseOptions, useDeleteSession, useSessions } from "../../features/courses/hooks"
import { useCategories } from "../../features/categories/hooks"
import type { Session } from "../../types/models"

const PAGE_SIZE = 10

export default function Sessions() {
    const { page, get, update } = useListParams()
    const category = get("category")
    const course = get("course")

    const { data, isLoading } = useSessions({
        page,
        limit: PAGE_SIZE,
        category: category || undefined,
        course: course || undefined,
    })
    const sessions = data?.items ?? []
    const { data: categories = [] } = useCategories()
    const { data: courses = [] } = useCourseOptions()
    const deleteSession = useDeleteSession()

    const remove = async (session: Session) => {
        const ok = await confirmToast({ title: `Remove "${session.title}"?`, description: "The session and its video will be deleted.", confirmLabel: "Remove" })
        if (ok) deleteSession.mutate(session._id)
    }

    return (
        <>
            <AddSessionForm />
            <DataTable title="Sessions" actions={
                <div className="d-flex flex-wrap gap-2">
                    <FilterSelect label="Filter by category" value={category}
                        onChange={(value) => update({ category: value, course: "" })}
                        options={categories.map(item => ({ value: item._id, label: item.title }))} allLabel="All categories" />
                    <SearchSelect label="Filter by course" value={course}
                        onChange={(value) => update({ course: value, category: "" })}
                        options={courses.map(item => ({ value: item._id, label: item.name }))} allLabel="All courses" placeholder="Search courses…" />
                </div>}>
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
                        {sessions.length ? sessions.map((session, index) => (
                            <tr key={session._id}>
                                <td className="text-body-secondary">{index + 1}</td>
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
                        )) : <EmptyRow colSpan={7}>{isLoading ? "Loading…" : category || course ? "No sessions match this filter." : "No sessions yet."}</EmptyRow>}
                    </tbody>
                </table>
            </DataTable>
            <Pagination pagination={data?.pagination} />
        </>
    )
}