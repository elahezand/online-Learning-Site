import { useState, useEffect } from 'react'
import SectionHeader from '../../modules/SectionHeader/SectionHeader';
import CourseSlider from './CourseSlider';

export default function PopularCourses() {
    const [popularCourses, setPopularCourses] = useState([])

    const getPopularCourses = async () => {
        try {
            const res = await fetch(`http://localhost:4000/v1/courses/popular`)
            if (res.status === 200) {
                const data = await res.json()
                setPopularCourses(data)
            }
        } catch (e) { }
    }

    useEffect(() => {
        getPopularCourses()
    }, [])

    return (
        <section className='container page-section'>
            <SectionHeader title="Most popular courses" desc="" />
            <CourseSlider courses={popularCourses} />
        </section>
    )
}
