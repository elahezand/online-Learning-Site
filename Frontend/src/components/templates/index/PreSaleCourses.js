import { useState, useEffect } from 'react'
import SectionHeader from '../../modules/SectionHeader/SectionHeader'
import CourseSlider from './CourseSlider';

export default function PreSaleCourses() {
    const [presellCourses, setPresellCourses] = useState([])

    const getPreSellCourses = async () => {
        try {
            const res = await fetch(`http://localhost:4000/v1/courses/presell`)
            if (res.ok) {
                const data = await res.json()
                setPresellCourses(data)
            }
        } catch (e) { }
    }

    useEffect(() => {
        getPreSellCourses()
    }, [])

    return (
        <section className='container page-section'>
            <SectionHeader title="Pre-sale Courses" desc="" btnTitle="more courses" btnHref="/courses/1" />
            <CourseSlider courses={presellCourses} />
        </section>
    )
}
