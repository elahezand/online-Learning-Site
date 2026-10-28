import { useParams } from "react-router-dom"
import PageHeader from "../../components/ui/PageHeader"
import CourseDetail from "../../features/courses/CourseDetail"
import { useCourse } from "../../features/courses/hooks"

export default function CourseInfo() {
    const { courseName } = useParams()
    const { data: course } = useCourse(courseName)
    const category = course?.categoryID

    return (
        <>
            <PageHeader
                title={course?.name ?? "Course"}
                image="/images/blog/bg_2.jpg.webp"
                breadcrumb={[
                    { title: "Home", to: "/" },
                    ...(category?.title ? [{ title: category.title, to: `/courses?category=${category.name}` }] : []),
                    { title: course?.name ?? "Course" },
                ]} />
            <CourseDetail />
        </>
    )
}
