import { Link, useNavigate, useParams } from "react-router-dom"
import { FaArrowLeft } from "react-icons/fa6"
import CourseForm from "../../features/courses/CourseForm"
import { useCourse } from "../../features/courses/hooks"
import PageLoader from "../../components/ui/PageLoader"

export default function EditCourse() {
    const { shortName } = useParams()
    const navigate = useNavigate()
    const { data: course, isLoading } = useCourse(shortName)

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