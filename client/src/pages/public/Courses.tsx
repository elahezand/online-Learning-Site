import PageHeader from '../../components/ui/PageHeader'
import NewsLetter from '../../features/newsletter/NewsLetter'
import CoursesList from '../../features/courses/CoursesList'

export default function Courses() {
    return (
        <>
            <PageHeader title="All courses" subtitle="Pick a path and start learning today"
                image="/images/blog/cute-freelance-girl-using-laptop-sitting-floor-smiling.jpg"
                breadcrumb={[{ title: "Home", to: "/" }, { title: "Courses" }]} />
            <CoursesList />
            <NewsLetter />
        </>
    )
}
