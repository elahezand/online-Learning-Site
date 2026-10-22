import { useMemo } from "react"
import { Link, useNavigate } from "react-router-dom"
import { FaPenToSquare, FaTrash } from "react-icons/fa6"
import DataTable from "../../components/ui/DataTable"
import Pagination from "../../components/ui/Pagination"
import usePagination from "../../hooks/usePagination"
import useQueryParam from "../../hooks/useQueryParam"
import FilterSelect from "../../components/ui/FilterSelect"
import ActionButton, { EmptyRow, RowActions, StatusBadge } from "../../components/ui/ActionButton"
import { confirmToast } from "../../components/ui/toastActions"
import CourseForm from "../../features/courses/CourseForm"
import { CourseCover } from "../../features/courses/CourseCard"
import { useCourses, useDeleteCourse } from "../../features/courses/hooks"
import { useCategories } from "../../features/categories/hooks"
import { categoryIdOf } from "../../features/courses/CourseView"
import type { Category, Course } from "../../types/models"

const NO_COURSES: Course[] = []
const NO_CATEGORIES: Category[] = []

export default function Courses() {
    const { data: courses = NO_COURSES } = useCourses()
    const { data: categories = NO_CATEGORIES } = useCategories()
    const navigate = useNavigate()
    const deleteCourse = useDeleteCourse()
    const [category, setCategory] = useQueryParam("category")

    const categoryName = useMemo(() => new Map(categories.map(item => [item._id, item.title])), [categories])

    const categoryOptions = useMemo(() => categories.map(item => ({
        value: item._id,
        label: item.title,
        count: courses.filter(course => categoryIdOf(course) === item._id).length,
    })), [categories, courses])

    const filtered = useMemo(() => category ?
        courses.filter(course => categoryIdOf(course) === category) : courses, [courses, category])

    const { page, pageCount, start, pageItems: paginatedData } = usePagination(filtered)

    const remove = async (course: Course) => {
        const ok = await confirmToast({ title: `Remove "${course.name}"?`, description: "The course and its sessions will be deleted.", confirmLabel: "Remove" })
        if (ok) deleteCourse.mutate(course._id)
    }

    return (
        <>
            <CourseForm />
            <DataTable title="Courses" actions={
                <FilterSelect label="Filter by category" value={category} onChange={setCategory}
                    options={categoryOptions} allLabel="All categories" allCount={courses.length} />}>
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
                                <td>
                                    <Link to={`/p-admin/course/${course._id}/edit`} className="d-flex align-items-center gap-3 link-body-emphasis text-decoration-none">
                                        <span className="flex-shrink-0 rounded-2 overflow-hidden" style={{ width: 96 }}><CourseCover cover={course.cover} /></span>
                                        <span className="fw-medium">{course.name}</span>
                                    </Link>
                                </td>
                                <td>{categoryName.get(categoryIdOf(course) ?? "") ?? "—"}</td>
                                <td><StatusBadge ok={course.isComplete} okLabel="Completed" pendingLabel="In progress" /></td>
                                <td>{course.shortName}</td>
                                <td>{course.creator}</td>
                                <td>{course.support}</td>
                                <td>{course.price === 0 ?
                                    <span className="fw-medium text-success">Free</span> :
                                    `${course.price?.toLocaleString()} $`}</td>
                                <td>
                                    <RowActions>
                                        <ActionButton icon={<FaPenToSquare />} onClick={() => navigate(`/p-admin/course/${course._id}/edit`)}>Edit</ActionButton>
                                        <ActionButton variant="danger" icon={<FaTrash />} onClick={() => remove(course)}>Remove</ActionButton>
                                    </RowActions>
                                </td>
                            </tr>
                        )) : <EmptyRow colSpan={9}>{category ? "No courses in this category." : "No courses yet."}</EmptyRow>}
                    </tbody>
                </table>
            </DataTable>
            <Pagination page={page} pageCount={pageCount} />
        </>
    )
}
