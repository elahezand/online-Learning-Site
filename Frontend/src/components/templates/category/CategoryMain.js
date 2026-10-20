import {useEffect, useState } from 'react'
import Course from "../../modules/Course/Course"
import { useParams } from 'react-router-dom';
import Pageination from '../../modules/Pageination/Pageination';
import Dropdown from 'react-bootstrap/Dropdown';
import { useCategoryCourses } from '../../../api';


// Stable fallback so the sorting effect below doesn't re-run on every render
const EMPTY = []

export default function CategoryMain() {
    const params = useParams();
    const { page, categoryName } = params

    const pageSize = 3

    const { data: courses = EMPTY } = useCategoryCourses(categoryName)
    const [currentPage, setCurrentPage] = useState("")

    const [orderedCourses, setOrderedCourses] = useState([])

    const [status, setStatuse] = useState("Default")

    const [changeStatus, setChangeStatuse] = useState("Default sorting")
    const [direction, setDirection] = useState("row")


    const searchCourses = (e) => {
        let filteredcourses = courses.filter(course => course.name.toLowerCase().includes(e.target.value))
        setOrderedCourses(filteredcourses)
    }

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
                    return prev = [...courses].reverse()
                })

                break
            }


        }
    }, [status, courses])


    const lastChild = currentPage * pageSize
    const firstChild = lastChild - pageSize

    const pageCount = Math.ceil(orderedCourses.length / pageSize)
    const paginatedData = orderedCourses.slice(firstChild, lastChild)

    const sortOptions = [
        { status: "Default", label: "Default sorting" },
        { status: "popularity", label: "sort by popularity" },
        { status: "Latest", label: "sort by Latest" },
        { status: "Free", label: "sort by Free" },
        { status: "money", label: "sort by Price" },
    ]

    return (
        <>
            {courses.length ?
                <div className='container mt-4'>
                    <div className='surface d-flex flex-column flex-md-row align-items-stretch align-items-md-center justify-content-between gap-3 p-3'>
                        <form action="#" className='input-icon flex-grow-1 category-toolbar__search'
                            onSubmit={(e) => e.preventDefault()}>
                            <input type="search" className='form-control'
                                onChange={(e) => searchCourses(e)}
                                placeholder='Search Courses...' aria-label="Search courses" />
                            <i className='fas fa-search input-icon__icon'></i>
                        </form>
                        <div className='d-flex align-items-center gap-2'>
                            <div className="btn-group" role="group" aria-label="Layout">
                                <button type="button"
                                    className={`btn ${direction === "row" ? "btn-primary" : "btn-outline-secondary"}`}
                                    onClick={() => setDirection("row")} aria-label="Grid view" aria-pressed={direction === "row"}>
                                    <i className="fas fa-border-all"></i>
                                </button>
                                <button type="button"
                                    className={`btn ${direction === "column" ? "btn-primary" : "btn-outline-secondary"}`}
                                    onClick={() => setDirection("column")} aria-label="List view" aria-pressed={direction === "column"}>
                                    <i className="fas fa-align-left"></i>
                                </button>
                            </div>
                            <Dropdown align="end" className="flex-grow-1 flex-md-grow-0">
                                <Dropdown.Toggle variant="outline-secondary" className="w-100 category-toolbar__sort">
                                    {changeStatus}
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    {sortOptions.map(option => (
                                        <Dropdown.Item as="button" key={option.status}
                                            active={status === option.status}
                                            onClick={() => {
                                                setStatuse(option.status)
                                                setChangeStatuse(option.label)
                                            }}>
                                            {option.label}
                                        </Dropdown.Item>
                                    ))}
                                </Dropdown.Menu>
                            </Dropdown>
                        </div>
                    </div>

                    <div className={`row g-4 mt-1 ${direction === "row" ? "row-cols-1 row-cols-sm-2 row-cols-lg-3" : "row-cols-1"}`}>
                        {paginatedData.length ?
                            paginatedData.map((course, index) => (
                                <div className="col" key={index}>
                                    <Course {...course} direction={direction} />
                                </div>
                            )) :
                            <div className="col"><div className='alert alert-warning mb-0'>there isn't any courses</div></div>
                        }
                    </div>

                    <Pageination
                        data={paginatedData}
                        pathName={`/category-info/${params.categoryName}`}
                        pageCount={pageCount}
                        currentPage={currentPage}
                    />
                </div>
                :
                <div className='container mt-4'>
                    <div className='alert alert-warning'>there is not any courses</div>
                </div>
            }
        </>
    )
}
