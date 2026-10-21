import { useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import Pagination from '../../components/ui/Pagination'
import usePagination from '../../hooks/usePagination'
import { CourseCover } from '../../features/courses/CourseCard'
import { useMyCourses } from '../../features/users/hooks'

const EMPTY = []

const FILTERS = {
    all: () => true,
    free: (item) => item.price === 0,
    price: (item) => item.price > 0,
    completed: (item) => item.course?.isComplete === 1,
    uncompleted: (item) => item.course?.isComplete !== 1,
}

export default function Courses() {
    const [searchParams, setSearchParams] = useSearchParams()
    const status = FILTERS[searchParams.get("status")] ? searchParams.get("status") : "all"

    const { data: coursesUser = EMPTY } = useMyCourses()
    const filteredData = useMemo(() => coursesUser.filter(FILTERS[status]), [coursesUser, status])
    const { page, pageCount, pageItems: paginatedData } = usePagination(filteredData, { limit: 5 })

    const setStatus = (next) => setSearchParams(next === "all" ? {} : { status: next })

    const filters = [
        { status: "all", label: "All" },
        { status: "free", label: "Free" },
        { status: "price", label: "Paid" },
        { status: "completed", label: "Completed" },
        { status: "uncompleted", label: "In progress" },
    ]

    return (
        <>
            <h2 className="h4 fw-bold mb-3">My courses</h2>
            <ul className="nav nav-pills flex-nowrap overflow-auto gap-2 pb-2 mb-3 border-bottom">
                {filters.map(filter => (
                    <li className="nav-item" key={filter.status}>
                        <button type="button"
                            className={`nav-link text-nowrap ${status === filter.status ? "active" : ""}`}
                            onClick={() => setStatus(filter.status)}>
                            {filter.label}
                        </button>
                    </li>
                ))}
            </ul>
            <div className="d-grid gap-3">
                {paginatedData.length ? paginatedData.map(item => (
                    <div className="card shadow-sm overflow-hidden" key={item._id}>
                        <div className="row g-0 align-items-center">
                            <div className="col-sm-4 col-md-3">
                                <CourseCover cover={item.course?.cover} />
                            </div>
                            <div className="col-sm-8 col-md-9">
                                <div className="card-body">
                                    <h3 className="h6 fw-bold mb-2">
                                        <Link to={`/course-info/${item.course?.shortName}`} className="link-body-emphasis stretched-link">{item.course?.name}</Link>
                                    </h3>
                                    <div className="d-flex flex-wrap gap-2 small">
                                        <span className="badge rounded-pill bg-secondary-subtle text-secondary-emphasis">
                                            {item.course?.price === 0 ? "Free" : `${item.course?.price?.toLocaleString()} $`}
                                        </span>
                                        <span className={`badge rounded-pill ${item.course?.isComplete === 1 ? "text-bg-success" : "bg-primary-subtle text-primary-emphasis"}`}>
                                            {item.course?.isComplete === 1 ? "Completed" : "Ongoing"}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )) : <div className="alert alert-primary mb-0">You have no courses here yet.</div>}
            </div>
            <Pagination page={page} pageCount={pageCount} />
        </>
    )
}
