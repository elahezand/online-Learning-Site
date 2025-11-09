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

    const [isShowImage, setIsImageShow] = useState(false)
    const [isShowError, setIsShowError] = useState(false)


    const onImageLoaded = () => setIsImageShow(true)
    const onImageError = () => setIsShowError(true)

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

    return (
        <>
            <ul className="course-buyed">
                <li
                    className={`courses-top-bar__selection-item ${status === "all" && "active"}`}
                    onClick={() => setStatus("all")}>
                    All Courses
                </li>
                <li
                    className={`courses-top-bar__selection-item ${status === "free" && "active"}`}
                    onClick={() => setStatus("free")}>
                    Free Courses
                </li>
                <li
                    className={`courses-top-bar__selection-item ${status === "price" && "active"}`}
                    onClick={() => setStatus("price")}>
                    Paid Courses
                </li>
                <li
                    className={`courses-top-bar__selection-item ${status === "completed" && "active"}`}
                    onClick={() => setStatus("comoleted")}>
                    Completed Courses
                </li>
                <li
                    className={`courses-top-bar__selection-item ${status === "uncompleted" && "active"}`}
                    onClick={() => setStatus("uncompleted")}>
                    Uncompleted Courses
                </li>
            </ul>
            <div className='row m-4 box-courses_buyed'>
                {paginatedData.length ? paginatedData.map((course, index) =>
                    <div className='course-buyed_box' key={index}>
                        {!isShowError ?
                            <img src={`http://localhost:4000/courses/covers/${course.course?.cover}`}
                                alt="" loading='lazy'
                                onLoad={onImageLoaded}
                                onError={onImageError} /> :
                            <BiSolidCameraOff
                                style={{ fontSize: "5rem", color: "var(--gray-color)" }} />
                        }
                        {!isShowImage && !isShowError &&
                            <div className='spinner'>
                                <Spinner />
                            </div>}
                        <div className="course-buyed_left">
                            <Link to={`/course-info/${course.course?.shortName}/1`}>
                                {course.course?.name}</Link>
                            <div className="information_buyed">
                                <div>
                                    <span> Price : </span>
                                    <span>
                                        {course.course?.price === 0 ? "Free" : course.course?.price}
                                    </span>
                                </div>

                                <div>
                                    <span> Status : </span>
                                    <span>{
                                        course.course?.isCompelete === 1 ? " Completed" : "Ongoing"}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : <div className='alert alert-danger'>
                    there isn't any courses</div>}
                <Pageination
                    data={paginatedData}
                    pathName={`/my-account/courses`}
                    pageCount={pageCount}
                    currentPage={currentPage} />

            </div>
        </>
    )
}
