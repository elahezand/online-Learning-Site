import {useEffect, useState } from 'react'
import Course from "../../modules/Course/Course"
import { useParams } from 'react-router-dom';
import Pageination from '../../modules/Pageination/Pageination';


export default function CategoryMain() {
    const params = useParams();
    const { page, categoryName } = params

    const pageSize = 3

    const [courses, setCourses] = useState([])
    const [currentPage, setCurrentPage] = useState("")

    const [orderedCourses, setOrderedCourses] = useState([])

    const [status, setStatuse] = useState("Default")

    const [changeStatus, setChangeStatuse] = useState("Default")
    const [direction, setDirection] = useState("row")

    const getCourseCategory = async () => {
        const res = await fetch(`http://localhost:4000/v1/courses/category/${categoryName}`, {
            method: "GET",
        })

        if (res.status === 200) {
            const data = await res.json()
            setCourses(data)
        }
    }


    const searchCourses = (e) => {
        let filteredcourses = courses.filter(course => course.name.toLowerCase().includes(e.target.value))
        setOrderedCourses(filteredcourses)
    }

    useEffect(() => {
        getCourseCategory()
    }, [])

    useEffect(() => {
        setCurrentPage(page)
    }, [categoryName, page])


    useEffect(() => {
        switch (status) {
            default: {
                setOrderedCourses(courses)
                break
            }
            case "Free": {
                setOrderedCourses(prev => {
                    return prev = courses.filter(course => course.price === 0)
                })
                break
            }

            case "popularity": {
                setOrderedCourses(prev => {
                    return prev = courses.filter(course => course.courseAverageScore === 5)
                })

                break
            }
            case "money": {
                setOrderedCourses(prev => {
                    return prev = courses.filter((course) => course.price > 0)
                })

                break
            }

            case "Latest": {
                setOrderedCourses(prev => {
                    return prev = courses.reverse()
                })

                break
            }


        }
    }, [status, courses])


    const lastChild = currentPage * pageSize
    const firstChild = lastChild - pageSize

    const pageCount = Math.ceil(orderedCourses.length / pageSize)
    const paginatedData = orderedCourses.slice(firstChild, lastChild)

    return (

        <>
            {courses.length ?
                <div className='container mt-5'>
                    <div className='courses-top-bar'>
                        <div className="courses-top-bar__left">
                            <form action="#" className='courses-top-bar__form'>
                                <input type="text" className='courses-top-bar__input'
                                    onChange={(e) => {
                                        searchCourses(e)
                                    }}
                                    placeholder='Search Courses...' />
                                <i className='fas fa-search'></i>
                            </form>
                        </div>
                        <div className='courses-top-bar__right'>
                            <div className={`courses-top-bar__row-btn courses-topbar-icon 
                  ${direction === "row" && "courses-top-bar__icon--active"}`} onClick={() => setDirection("row")}>
                                <i className="fas fa-border-all courses-top-bar__icon" ></i>
                            </div>
                            <div className={`courses-top-bar__column-btn courses-topbar-icon 
                   ${direction === "column" && "courses-top-bar__icon--active"}`} onClick={() => setDirection("column")}>
                                <i className="fas fa-align-left courses-top-bar__icon"></i>
                            </div>
                            <div className="courses-top-bar__selection">
                                <span className="courses-top-bar__selection-title">{changeStatus}
                                    <i className="fas fa-angle-down courses-top-bar__selection-icon"></i>
                                </span>
                                <ul className="courses-top-bar__selection-list">
                                    <li className="courses-top-bar__selection-item"
                                        onClick={(e) => {
                                            setStatuse("Default")
                                            setChangeStatuse(e.target.textContent)
                                        }}
                                    >
                                        Default sorting</li>
                                    <li className="courses-top-bar__selection-item " onClick={(e) => {
                                        setStatuse("popularity")
                                        setChangeStatuse(e.target.textContent)
                                    }} >sort by popularity</li>
                                    <li className="courses-top-bar__selection-item " onClick={(e) => {
                                        setStatuse("Latest")
                                        setChangeStatuse(e.target.textContent)
                                    }}>sort by Latest  </li>
                                    <li className="courses-top-bar__selection-item " onClick={(e) => {
                                        setStatuse("Free")
                                        setChangeStatuse(e.target.textContent)
                                    }}>sort by Free </li>
                                    <li className="courses-top-bar__selection-item " onClick={(e) => {
                                        setStatuse("money")
                                        setChangeStatuse(e.target.textContent)
                                    }}>sort by Price </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className='row m-5 justify-content-center' style={{ gap: "1rem 0" }}>
                        {paginatedData.length ?
                            paginatedData.map((course, index) => (
                                <div className={direction === "row" ? "col-4" : "col-12"}>
                                    <Course key={index} {...course} direction={direction} />
                                </div>
                            )) :
                            <div className='alert alert-warning'>there isn't any courses</div>
                        }

                        <Pageination
                            data={paginatedData}
                            pathName={`/category-info/${params.categoryName}`}
                            pageCount={pageCount}
                            currentPage={currentPage}
                        />
                    </div>
                </div>
                :
                <div className='alert -alert-warning'> there is not any courses</div>
            }

        </>
    )
}


