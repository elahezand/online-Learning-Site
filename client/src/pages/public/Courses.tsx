import PageHeader from '../../components/layout/PageHeader'
import Pagination from '../../components/ui/Pagination'
import usePagination from '../../hooks/usePagination'
import { useCourses } from '../../features/courses/hooks'
import CoursesList from "../../features/courses/CoursesList"
import NewsLetter from '../../features/newsletter/NewsLetter'

export default function Courses() {
    const { data: courses = [] } = useCourses()
    const { page, pageCount, pageItems } = usePagination(courses, { limit: 9 })

    return (
        <>
            <PageHeader title="All courses" subtitle="Pick a path and start learning today"
                image="/images/blog/cute-freelance-girl-using-laptop-sitting-floor-smiling.jpg"
                breadcrumb={[{ title: "Home", to: "/" }, { title: "Courses" }]} />
            <CoursesList showData={pageItems} />
            <Pagination page={page} pageCount={pageCount} />
            <NewsLetter />
        </>
    )
}
