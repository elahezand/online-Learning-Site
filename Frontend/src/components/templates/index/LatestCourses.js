import { useEffect, useState } from 'react'
import Course from '../../modules/Course/Course'
import SectionHeader from '../../modules/SectionHeader/SectionHeader'
import useFramer from '../../../Hooks/useFramer'

export default function LateatCourses() {
    const [isShowView, ref] = useFramer()
    const [allCourseData, SetAllCourseData] = useState([])

    const getLatestCourse = async () => {
        try {
            const res = await fetch(`http://localhost:4000/v1/courses`)
            if (res.status === 200) {
                const data = await res.json()
                SetAllCourseData(data.slice(0, 8))
            }
        } catch (e) { }
    }
    useEffect(() => {
        getLatestCourse()
    }, [])

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
