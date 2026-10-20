import { usePresellCourses } from '../../../api'
import SectionHeader from '../../modules/SectionHeader/SectionHeader'
import CourseSlider from './CourseSlider';

export default function PreSaleCourses() {
    const { data: presellCourses = [] } = usePresellCourses()

    return (
        <section className='container page-section'>
            <SectionHeader title="Pre-sale Courses" desc="" btnTitle="more courses" btnHref="/courses/1" />
            <CourseSlider courses={presellCourses} />
        </section>
    )
}
