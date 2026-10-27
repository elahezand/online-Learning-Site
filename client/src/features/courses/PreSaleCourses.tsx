import { useCourses } from "./hooks"
import SectionHeader from "../../components/ui/SectionHeader"
import CourseSlider from "./CourseSlider"

export default function PreSaleCourses() {
    const { data } = useCourses({ status: "presell", limit: 8 })
    const courses = data?.items ?? []
   
    return (
        <section className="container py-5">
            <SectionHeader title="Pre-sale courses" desc="Join early at a lower price" btnTitle="All courses" btnHref="/courses" />
            <CourseSlider courses={courses} />
        </section>
    )
}
