import { useMemo, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import Dropdown from 'react-bootstrap/Dropdown'
import { FaAlignLeft, FaBorderAll, FaMagnifyingGlass } from 'react-icons/fa6'
import Pagination from '../../components/ui/Pagination'
import usePagination from '../../hooks/usePagination'
import CourseCard from "./CourseCard"
import { useCategoryCourses } from './hooks'

const EMPTY = []

const SORTS = {
    Default: (courses) => courses,
    popularity: (courses) => courses.filter(course => course.courseAverageScore === 5),
    Latest: (courses) => [...courses].reverse(),
    Free: (courses) => courses.filter(course => course.price === 0),
    money: (courses) => courses.filter(course => course.price > 0),
}

export default function CategoryCourses() {
    const { categoryName } = useParams()
    const [, setSearchParams] = useSearchParams()
    const { data: courses = EMPTY } = useCategoryCourses(categoryName)

    const [query, setQuery] = useState("")
    const [status, setStatuse] = useState("Default")
    const [changeStatus, setChangeStatuse] = useState("Default sorting")
    const [direction, setDirection] = useState("row")

    const orderedCourses = useMemo(() => {
        const text = query.trim().toLowerCase()
        const matching = text ? courses.filter(course => course.name.toLowerCase().includes(text)) : courses
        return SORTS[status](matching)
    }, [courses, query, status])

    const { page, pageCount, pageItems: paginatedData } = usePagination(orderedCourses, { limit: 9 })

    const backToFirstPage = () => setSearchParams(params => {
        params.delete("page")
        return params
    }, { replace: true })

    const searchCourses = (e) => {
        setQuery(e.target.value)
        backToFirstPage()
    }

    const sortOptions = [
        { status: "Default", label: "Default sorting" },
        { status: "popularity", label: "Most popular" },
        { status: "Latest", label: "Latest" },
        { status: "Free", label: "Free only" },
        { status: "money", label: "Paid only" },
    ]

    return (
        <div className="container py-4 py-lg-5">
            {courses.length ?
                <>
                    <div className="card shadow-sm">
                        <div className="card-body d-flex flex-column flex-md-row align-items-stretch align-items-md-center gap-3">
                            <form className="flex-grow-1" role="search" onSubmit={(e) => e.preventDefault()}>
                                <div className="input-group">
                                    <span className="input-group-text bg-body"><FaMagnifyingGlass /></span>
                                    <input type="search" className="form-control border-start-0"
                                        onChange={(e) => searchCourses(e)}
                                        placeholder="Search courses…" aria-label="Search courses" />
                                </div>
                            </form>
                            <div className="d-flex align-items-center gap-2">
                                <div className="btn-group" role="group" aria-label="Layout">
                                    <button type="button"
                                        className={`btn ${direction === "row" ? "btn-primary" : "btn-outline-secondary"}`}
                                        onClick={() => setDirection("row")} aria-label="Grid view" aria-pressed={direction === "row"}>
                                        <FaBorderAll />
                                    </button>
                                    <button type="button"
                                        className={`btn ${direction === "column" ? "btn-primary" : "btn-outline-secondary"}`}
                                        onClick={() => setDirection("column")} aria-label="List view" aria-pressed={direction === "column"}>
                                        <FaAlignLeft />
                                    </button>
                                </div>
                                <Dropdown align="end" className="flex-grow-1 flex-md-grow-0">
                                    <Dropdown.Toggle variant="outline-secondary" className="w-100 text-nowrap">
                                        {changeStatus}
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        {sortOptions.map(option => (
                                            <Dropdown.Item as="button" key={option.status}
                                                active={status === option.status}
                                                onClick={() => {
                                                    setStatuse(option.status)
                                                    setChangeStatuse(option.label)
                                                    backToFirstPage()
                                                }}>
                                                {option.label}
                                            </Dropdown.Item>
                                        ))}
                                    </Dropdown.Menu>
                                </Dropdown>
                            </div>
                        </div>
                    </div>

                    <div className={`row g-4 mt-1 ${direction === "row" ? "row-cols-1 row-cols-sm-2 row-cols-lg-3" : "row-cols-1"}`}>
                        {paginatedData.length ?
                            paginatedData.map(course => (
                                <div className="col" key={course._id}>
                                    <CourseCard {...course} direction={direction} />
                                </div>
                            )) :
                            <div className="col"><div className="alert alert-warning mb-0">No courses match your search.</div></div>}
                    </div>

                    <Pagination page={page} pageCount={pageCount} />
                </> :
                <div className="alert alert-primary mb-0">There are no courses in this category yet.</div>}
        </div>
    )
}
