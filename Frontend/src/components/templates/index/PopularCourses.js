import { usePopularCourses } from '../../../api'
import SectionHeader from '../../modules/SectionHeader/SectionHeader';
import CourseSlider from './CourseSlider';

export default function PopularCourses() {
    const { data: popularCourses = [] } = usePopularCourses()

    return (
        <section className='container page-section'>
            <SectionHeader title="Most popular courses" desc="" />
            <CourseSlider courses={popularCourses} />
        </section>
    )
}
