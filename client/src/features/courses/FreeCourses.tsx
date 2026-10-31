import { useCourses } from "./hooks"
import SectionHeader from "../../components/ui/SectionHeader"
import CourseSlider from "./CourseSlider"

export default function FreeCourses() {
    const { data } = useCourses({ free: 1, limit: 8 })
    const courses = data?.items ?? []

    if (!courses.length) return null

    return (
        <section className="container py-5">
            <SectionHeader title="Start for free" desc="Try a full course before you spend anything" btnTitle="All free courses" btnHref="/courses?price=free" />
            <CourseSlider courses={courses} />
        </section>
    )
}
