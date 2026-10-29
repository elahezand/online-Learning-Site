import { Link, useNavigate } from "react-router-dom"
import { FaMagnifyingGlass, FaPenToSquare, FaTrash } from "react-icons/fa6"
import DataTable from "../../components/ui/DataTable"
import Pagination from "../../components/ui/Pagination"
import FilterSelect from "../../components/ui/FilterSelect"
import ActionButton, { EmptyRow, RowActions, StatusBadge } from "../../components/ui/ActionButton"
import { confirmToast } from "../../components/ui/toastActions"
import useListParams from "../../hooks/useListParams"
import useDebouncedValue from "../../hooks/useDebouncedValue"
import CourseForm from "../../features/courses/CourseForm"
import { CourseCover } from "../../features/courses/CourseCard"
import { useCourses, useDeleteCourse } from "../../features/courses/hooks"
import { useCategories } from "../../features/categories/hooks"
import type { Course } from "../../types/models"

const PAGE_SIZE = 12

const categoryTitle = (course: Course) =>
    course.categoryID && typeof course.categoryID === "object" ? course.categoryID.title : "—"

export default function Courses() {
    const navigate = useNavigate()

    const { page, get, update } = useListParams()
    const search = get("search")
    const category = get("category")
    const debouncedSearch = useDebouncedValue(search.trim())

    const { data: categories = [] } = useCategories()
    const { data, isLoading } = useCourses({
        category: category || undefined,
        page,
        limit: PAGE_SIZE,
        search: debouncedSearch || undefined,
    })
    const courses = data?.items ?? []
    const deleteCourse = useDeleteCourse()

    const remove = async (course: Course) => {
        const ok = await confirmToast({ title: `Remove "${course.name}"?`, description: "The course and its sessions will be deleted.", confirmLabel: "Remove" })
        if (ok) deleteCourse.mutate(course._id)
    }

    return (
        <>
            <CourseForm />
            <DataTable title="Courses" actions={
                <div className="d-flex flex-wrap align-items-center gap-2">
                    <div className="input-group input-group-sm w-auto">
                        <span className="input-group-text bg-body"><FaMagnifyingGlass /></span>
                        <input type="search" className="form-control" value={search}
                            onChange={(e) => update({ search: e.target.value })}
                            placeholder="Search courses…" aria-label="Search courses" />
                    </div>
                    <FilterSelect label="Filter by category" allLabel="All categories" value={category}
                        onChange={(value) => update({ category: value })}
                        options={categories.map(item => ({ value: item.name, label: item.title, count: item.coursesCount }))} />
                </div>}>
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
                        {courses.length ? courses.map((course, index) => (
                            <tr key={course._id}>
                                <td className="text-body-secondary">{index + 1}</td>
                                <td>
                                    <Link to={`/p-admin/course/${course.shortName}/edit`} className="d-flex align-items-center gap-3 link-body-emphasis text-decoration-none">
                                        <span className="flex-shrink-0 rounded-2 overflow-hidden" style={{ width: 96 }}><CourseCover cover={course.cover} /></span>
                                        <span className="fw-medium">{course.name}</span>
                                    </Link>
                                </td>
                                <td>{categoryTitle(course)}</td>
                                <td><StatusBadge ok={course.isComplete} okLabel="Completed" pendingLabel="In progress" /></td>
                                <td>{course.shortName}</td>
                                <td>{course.creator?.name ?? "—"}</td>
                                <td>{course.support}</td>
                                <td>{course.price === 0 ?
                                    <span className="fw-medium text-success">Free</span> :
                                    `${course.price?.toLocaleString()} $`}</td>
                                <td>
                                    <RowActions>
                                        <ActionButton icon={<FaPenToSquare />} onClick={() => navigate(`/p-admin/course/${course.shortName}/edit`)}>Edit</ActionButton>
                                        <ActionButton variant="danger" icon={<FaTrash />} onClick={() => remove(course)}>Remove</ActionButton>
                                    </RowActions>
                                </td>
                            </tr>
                        )) : <EmptyRow colSpan={9}>{isLoading ? "Loading…" : category || search ? "No courses match this filter." : "No courses yet."}</EmptyRow>}
                    </tbody>
                </table>
            </DataTable>
            <Pagination pagination={data?.pagination} />
        </>
    )
}