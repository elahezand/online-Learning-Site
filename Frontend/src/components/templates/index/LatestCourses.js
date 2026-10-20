import { useCourses } from '../../../api'
import Course from '../../modules/Course/Course'
import SectionHeader from '../../modules/SectionHeader/SectionHeader'
import useFramer from '../../../Hooks/useFramer'

export default function LateatCourses() {
    const [isShowView, ref] = useFramer()
    const { data: courses = [] } = useCourses()
    const allCourseData = courses.slice(0, 8)

    return (
        <section className='container page-section'>
            <SectionHeader
                title="Latest Courses"
                desc="Your Launchpad to Success"
                btnTitle="more courses"
                btnHref="/courses/1" />

            <div ref={ref}
                className={`row row-cols-1 row-cols-sm-2 row-cols-lg-3 row-cols-xl-4 g-4 reveal ${isShowView ? "is-visible" : ""}`}>
                {allCourseData.map((course, index) => (
                    <div key={index} className='col'>
                        <Course {...course} />
                    </div>
                ))}
            </div>
        </section>
    )
}
