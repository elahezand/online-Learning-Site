import { useMemo } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { FaArrowLeft } from "react-icons/fa6"
import CourseForm from "../../features/courses/CourseForm"
import { useCourse, useCourses } from "../../features/courses/hooks"
import PageLoader from "../../components/ui/PageLoader"
import type { Course } from "../../types/models"

export default function EditCourse() {
    const { id } = useParams()
    const navigate = useNavigate()
    const { data: courses, isLoading } = useCourses()
    const listed = courses?.find(item => item._id === id)
    const { data: detail } = useCourse(listed?.shortName)

    const course = useMemo<Course | undefined>(() => listed && {
        ...listed,
        description: listed.description ?? detail?.description,
        categoryID: listed.categoryID ?? detail?.categoryID,
    }, [listed, detail])

    if (isLoading) return <PageLoader />

    return (
        <>
            <Link to="/p-admin/courses" className="btn btn-sm btn-outline-secondary d-inline-flex align-items-center gap-2 mb-3">
                <FaArrowLeft /> Back to courses
            </Link>
            {course ?
                <CourseForm course={course} onSaved={() => navigate("/p-admin/courses")} /> :
                <div className="alert alert-warning">This course doesn't exist or was removed.</div>}
        </>
    )
}
