import { useEffect, useState } from 'react'
import Pageination from '../../components/modules/Pageination/Pageination'
import { Link } from 'react-router-dom'
import Spinner from 'react-bootstrap/esm/Spinner'
import { useParams } from 'react-router-dom'
import { BiSolidCameraOff } from "react-icons/bi";
import "../../styles/p-user/courses.css"
import getMe from '../../utils/auth';

export default function CoursesUser() {
    const param = useParams()
    const { page } = param
    const pageSize = 4

    const [coursesUser, setCoursesUser] = useState([])
    const [currentPage, setCurrentPage] = useState(1)

    const [filteredData, setFilteredData] = useState([])

    const [status, setStatus] = useState("")

    const getUserCourses = async () => {
        const token = await getMe()
        if (token) {
            const res = await fetch("http://localhost:4000/v1/users/courses", {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token} `
                }
            })
            if (res.ok) {
                const data = await res.json()
                setCoursesUser(data)
            }
        }
    }


    useEffect(() => {
        getUserCourses()
    }, [])

    useEffect(() => {
        setCurrentPage(page)
    }, [page, currentPage])


    useEffect(() => {
        switch (status) {
            case 'free': {
                setFilteredData(prev => {
                    return prev = coursesUser.filter(course => course.price === 0)
                })

                break
            }

            case 'all': {
                setFilteredData(coursesUser)
                break
            }

            case 'price': {
                setFilteredData(prev => {
                    return prev = coursesUser.filter(course => course.price > 0)
                })

                break
            }

            case 'completed': {
                setFilteredData(prev => {
                    return prev = coursesUser.filter(course => course.isComplete === 0)
                })

                break
            }

            case 'uncompleted': {
                setFilteredData(prev => {
                    return prev = coursesUser.filter(course => course.isComplete === 1)
                })

                break
            }

            default: {
                setFilteredData(coursesUser)
                break
            }
        }
    }, [status,coursesUser])

    const lastChild = currentPage * pageSize
    const firstChild = lastChild - pageSize

    const pageCount = Math.ceil(filteredData.length / pageSize)
    const paginatedData = filteredData.slice(firstChild, lastChild)

    const filters = [
        { status: "all", label: "All Courses" },
        { status: "free", label: "Free Courses" },
        { status: "price", label: "Paid Courses" },
        { status: "completed", label: "Completed Courses" },
        { status: "uncompleted", label: "Uncompleted Courses" },
    ]

    return (
        <>
            <h1 className="h4 mb-3">My Courses</h1>
            <ul className="nav nav-pills flex-nowrap overflow-auto gap-2 pb-2 mb-3 border-bottom">
                {filters.map(filter => (
                    <li className="nav-item" key={filter.status}>
                        <button type="button"
                            className={`nav-link text-nowrap ${(status || "all") === filter.status ? "active" : ""}`}
                            onClick={() => setStatus(filter.status)}>
                            {filter.label}
                        </button>
                    </li>
                ))}
            </ul>
            <div className='d-flex flex-column gap-3'>
                {paginatedData.length ? paginatedData.map((course, index) =>
                    <div className='surface d-flex flex-column flex-sm-row gap-3 p-3' key={index}>
                        <BoughtCourseCover cover={course.course?.cover} />
                        <div className="d-flex flex-column justify-content-center gap-2 min-w-0">
                            <Link to={`/course-info/${course.course?.shortName}/1`} className="h5 mb-0 text-heading">
                                {course.course?.name}</Link>
                            <div className="d-flex flex-wrap gap-3 small">
                                <span>
                                    <span className="text-primary-strong fw-medium">Price : </span>
                                    {course.course?.price === 0 ? "Free" : course.course?.price}
                                </span>
                                <span>
                                    <span className="text-primary-strong fw-medium">Status : </span>
                                    {course.course?.isCompelete === 1 ? " Completed" : "Ongoing"}
                                </span>
                            </div>
                        </div>
                    </div>
                ) : <div className='alert alert-danger'>
                    there isn't any courses</div>}
            </div>
            <Pageination
                data={paginatedData}
                pathName={`/my-account/courses`}
                pageCount={pageCount}
                currentPage={currentPage} />
        </>
    )
}

function BoughtCourseCover({ cover }) {
    const [isShowImage, setIsImageShow] = useState(false)
    const [isShowError, setIsShowError] = useState(false)

    return (
        <div className="bought-course__cover">
            {!isShowError ?
                <img src={`http://localhost:4000/courses/covers/${cover}`}
                    alt="" loading='lazy'
                    onLoad={() => setIsImageShow(true)}
                    onError={() => setIsShowError(true)} /> :
                <div className="img-fallback"><BiSolidCameraOff /></div>
            }
            {!isShowImage && !isShowError &&
                <div className='bought-course__spinner'>
                    <Spinner animation="border" size="sm" />
                </div>}
        </div>
    )
}
