import React, { useState, useEffect, Suspense } from 'react'
import { useParams } from 'react-router-dom'
import "../styles/courses.css"
import Topbar from '../components/modules/Topbar/Topbar'
import CoursesMain from "../components/templates/courses/CoursesMain"
import Pageination from '../components/modules/Pageination/Pageination'
import NewsLetter from '../components/modules/NewsLetter/NewsLetter'
import Footer from '../components/modules/Footer/Footer'
const Landing = React.lazy(() =>
    import('../components/modules/Landing/Landing'))

export default function Courses() {
    const param = useParams()
    const { page } = param

    const pageSize = 3
    const [courses, setCourses] = useState([])
    const [currentPage, setCurrentPage] = useState("")

    useEffect(() => {
        setCurrentPage(page)
        fetch(`http://localhost:4000/v1/courses`)
            .then(res => res.json())
            .then(data => {
                setCourses(data)
            })
    }, [currentPage, page])


    const lastChild = currentPage * pageSize
    const firstChild = lastChild - pageSize

    const pageCount = Math.ceil(courses.length / pageSize)
    const paginatedData = courses.slice(firstChild, lastChild)

    return (
        <>
            <Topbar />
            <Suspense fallback={<span>loading....</span>}>
                <Landing url="/images/blog/cute-freelance-girl-using-laptop-sitting-floor-smiling.jpg" />
            </Suspense>
            <CoursesMain
                showData={paginatedData} />
            <Pageination
                data={paginatedData}
                pathName={`/courses`}
                pageCount={pageCount}
                currentPage={currentPage} />
            <NewsLetter />
            <Footer />
        </>
    )
}
