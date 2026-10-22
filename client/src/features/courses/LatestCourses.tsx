import { useCourses } from "./hooks"
import CourseCard from "./CourseCard"
import SectionHeader from "../../components/ui/SectionHeader"
import useInView from "../../hooks/useInView"

export default function LatestCourses() {
    const [isVisible, ref] = useInView()
    const { data: courses = [] } = useCourses()

    return (
        <section className="container py-5">
            <SectionHeader title="Latest courses" desc="Your launchpad to success" btnTitle="All courses" btnHref="/courses" />
            <div ref={ref} className={`row row-cols-1 row-cols-sm-2 row-cols-lg-3 row-cols-xl-4 g-4 fade ${isVisible ? "show" : ""}`}>
                {courses.slice(0, 8).map(course => (
                    <div key={course._id} className="col">
                        <CourseCard {...course} />
                    </div>
                ))}
            </div>
        </section>
    )
}
