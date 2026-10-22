import { useMemo } from "react"
import { FaTrash } from "react-icons/fa6"
import DataTable from "../../components/ui/DataTable"
import Pagination from "../../components/ui/Pagination"
import usePagination from "../../hooks/usePagination"
import useQueryParam from "../../hooks/useQueryParam"
import FilterSelect from "../../components/ui/FilterSelect"
import ActionButton, { EmptyRow, RowActions, StatusBadge } from "../../components/ui/ActionButton"
import { confirmToast } from "../../components/ui/toastActions"
import AddSessionForm from "../../features/courses/AddSessionForm"
import { useCourses, useDeleteSession, useSessions } from "../../features/courses/hooks"
import { useCategories } from "../../features/categories/hooks"
import { categoryIdOf } from "../../features/courses/CourseView"
import type { Category, Course, Session } from "../../types/models"

const NO_SESSIONS: Session[] = []
const NO_COURSES: Course[] = []
const NO_CATEGORIES: Category[] = []

export default function Sessions() {
    const { data: sessions = NO_SESSIONS } = useSessions()
    const { data: courses = NO_COURSES } = useCourses()
    const { data: categories = NO_CATEGORIES } = useCategories()
    const deleteSession = useDeleteSession()
    const [category, setCategory] = useQueryParam("category")
    const [course, setCourse] = useQueryParam("course")

    const categoryOfCourse = useMemo(() => new Map(courses.map(item => [item._id, categoryIdOf(item)])), [courses])
    const inCategory = useMemo(() => category ?
        sessions.filter(session => categoryOfCourse.get(session.course?._id ?? "") === category) : sessions,
        [sessions, category, categoryOfCourse])

    const categoryOptions = useMemo(() => categories.map(item => ({
        value: item._id,
        label: item.title,
        count: sessions.filter(session => categoryOfCourse.get(session.course?._id ?? "") === item._id).length,
    })), [categories, sessions, categoryOfCourse])

    // Only the courses of the chosen category
    const courseOptions = useMemo(() => courses
        .filter(item => !category || categoryIdOf(item) === category)
        .map(item => ({ value: item._id, label: item.name, count: sessions.filter(session => session.course?._id === item._id).length })),
        [courses, category, sessions])

    const filtered = useMemo(() => course ?
        inCategory.filter(session => session.course?._id === course) : inCategory, [inCategory, course])

    const { page, pageCount, start, pageItems: paginatedData } = usePagination(filtered)

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
                        onChange={(value) => setCategory(value, { course: "" })}
                        options={categoryOptions} allLabel="All categories" allCount={sessions.length} />
                    <FilterSelect label="Filter by course" value={course} onChange={setCourse}
                        options={courseOptions} allLabel={category ? "All courses in this category" : "All courses"} allCount={inCategory.length} />
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
                        )) : <EmptyRow colSpan={7}>{category || course ? "No sessions match this filter." : "No sessions yet."}</EmptyRow>}
                    </tbody>
                </table>
            </DataTable>
            <Pagination page={page} pageCount={pageCount} />
        </>
    )
}
