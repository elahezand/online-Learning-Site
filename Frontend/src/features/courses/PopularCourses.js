import { usePopularCourses } from "./hooks"
import SectionHeader from "../../components/ui/SectionHeader"
import CourseSlider from "./CourseSlider"

export default function PopularCourses() {
    const { data: courses = [] } = usePopularCourses()
    if (!courses.length) return null

    return (
        <section className="container py-5">
            <SectionHeader title="Most popular courses" desc="What other students are taking right now" />
            <CourseSlider courses={courses} />
        </section>
    )
}
