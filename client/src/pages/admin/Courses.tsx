import { FaTrash } from "react-icons/fa6"
import DataTable from "../../components/ui/DataTable"
import Pagination from "../../components/ui/Pagination"
import usePagination from "../../hooks/usePagination"
import ActionButton, { EmptyRow, RowActions, StatusBadge } from "../../components/ui/ActionButton"
import { confirmToast } from "../../components/ui/toastActions"
import AddCourseForm from "../../features/courses/AddCourseForm"
import { useCourses, useDeleteCourse } from "../../features/courses/hooks"
import type { Course } from "../../types/models"

export default function Courses() {
        const { data: courses = [] } = useCourses()
    const deleteCourse = useDeleteCourse()


    const { page, pageCount, start, pageItems: paginatedData } = usePagination(courses)

    const remove = async (course: Course) => {
        const ok = await confirmToast({ title: `Remove "${course.name}"?`, description: "The course and its sessions will be deleted.", confirmLabel: "Remove" })
        if (ok) deleteCourse.mutate(course._id)
    }

    return (
        <>
            <AddCourseForm />
            <DataTable title="Courses">
                <table className="table table-hover align-middle text-nowrap mb-0">
                    <thead>
                        <tr>
                            <th className="text-body-secondary">#</th>
                            <th>Name</th>
                            <th>Category</th>
                            <th>Status</th>
                            <th>Link</th>
                            <th>Teacher</th>
                            <th>Support</th>
                            <th>Price</th>
                            <th className="text-end">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedData.length ? paginatedData.map((course, index) => (
                            <tr key={course._id}>
                                <td className="text-body-secondary">{start + index + 1}</td>
                                <td className="fw-medium text-body-emphasis">{course.name}</td>
                                <td>{typeof course.categoryID === "object" ? course.categoryID.title : "—"}</td>
                                <td><StatusBadge ok={course.isComplete} okLabel="Completed" pendingLabel="In progress" /></td>
                                <td>{course.shortName}</td>
                                <td>{course.creator}</td>
                                <td>{course.support}</td>
                                <td>{course.price === 0 ?
                                    <span className="fw-medium text-success">Free</span> :
                                    `${course.price?.toLocaleString()} $`}</td>
                                <td>
                                    <RowActions>
                                        <ActionButton variant="danger" icon={<FaTrash />} onClick={() => remove(course)}>Remove</ActionButton>
                                    </RowActions>
                                </td>
                            </tr>
                        )) : <EmptyRow colSpan={9}>No courses yet.</EmptyRow>}
                    </tbody>
                </table>
            </DataTable>
            <Pagination page={page} pageCount={pageCount} />
        </>
    )
}
