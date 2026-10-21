import { useParams } from "react-router-dom"
import PageHeader from "../../components/layout/PageHeader"
import CourseDetail from "../../features/courses/CourseDetail"
import NewsLetter from "../../features/newsletter/NewsLetter"
import { useCourse } from "../../features/courses/hooks"

export default function CourseInfo() {
    const { courseName } = useParams()
    // Same query as CourseDetail: served from cache, no second request
    const { data: course } = useCourse(courseName)
    const category = course?.categoryID

    return (
        <>
            <PageHeader
                title={course?.name ?? "Course"}
                image="/images/blog/bg_2.jpg.webp"
                breadcrumb={[
                    { title: "Home", to: "/" },
                    ...(category?.title ? [{ title: category.title, to: `/category-info/${category.name}` }] : []),
                    { title: course?.name ?? "Course" },
                ]} />
            <CourseDetail />
            <NewsLetter />
        </>
    )
}
