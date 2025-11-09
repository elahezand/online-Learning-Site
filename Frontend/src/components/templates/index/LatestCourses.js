import { useEffect, useState } from 'react'
import "./LatestCourses.css"
import Course from '../../modules/Course/Course'
import SectionHeader from '../../modules/SectionHeader/SectionHeader'
import useFramer from '../../../Hooks/useFramer'
export default function LateatCourses(props) {
    const [isShowView, ref] = useFramer()
    const [allCourseData, SetAllCourseData] = useState([])

    const getLatestCourse = async () => {
        const res = await fetch(`http://localhost:4000/v1/courses`)
        if (res.status === 200) {
            const data = await res.json()
            SetAllCourseData(data.slice(0, 8))
        }
    }
    useEffect(() => {
        getLatestCourse()
    }, [])


    return (

        <div className='container' style={{ marginTop: "10rem" }}>
            <SectionHeader
                title="Latest Courses"
                desc="Your Launchpad to Success"
                btnTitle="more courses"
                btnHref="/courses/1" />

            <div ref={ref}
                className='row'
                style={{
                    gap: "2rem 0", margin: "0 5rem",
                    opacity: isShowView ? 1 : 0,
                    transform: isShowView ? "translateY(0px)" : "translateY(80px)"
                }}>
                {allCourseData.map((course, index) => (
                    <div key={index} className='col-3'>
                        <Course  {...course} />
                    </div>
                ))}
            </div>

        </div>
    )
}


