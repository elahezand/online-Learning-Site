import { Link } from 'react-router-dom'
import Pagination from '../../components/ui/Pagination'
import useListParams from '../../hooks/useListParams'
import { CourseCover } from '../../features/courses/CourseCard'
import { useMyCourses } from '../../features/users/hooks'
import type { MyCoursesQuery } from '../../features/users/hooks'

type Status = NonNullable<MyCoursesQuery["status"]>

const FILTERS: { status: Status | ""; label: string }[] = [
    { status: "", label: "All" },
    { status: "free", label: "Free" },
    { status: "paid", label: "Paid" },
    { status: "completed", label: "Completed" },
    { status: "in-progress", label: "In progress" },
]

const PAGE_SIZE = 5

export default function Courses() {
    const { page, get, update } = useListParams()
    const status = FILTERS.find(filter => filter.status === get("status"))?.status ?? ""

    const { data, isLoading } = useMyCourses({ page, limit: PAGE_SIZE, status: status || undefined })
    console.log(data);
    
    const courses = data?.items ?? []

    return (
        <>
            <h2 className="h4 fw-bold mb-3">My courses</h2>
            <ul className="nav nav-pills flex-nowrap overflow-auto gap-2 pb-2 mb-3 border-bottom">
                {FILTERS.map(filter => (
                    <li className="nav-item" key={filter.label}>
                        <button type="button"
                            className={`nav-link text-nowrap ${status === filter.status ? "active" : ""}`}
                            onClick={() => update({ status: filter.status })}>
                            {filter.label}
                        </button>
                    </li>
                ))}
            </ul>

            <div className="d-grid gap-3">
                {isLoading ?
                    <div className="text-center py-5"><div className="spinner-border text-primary" role="status" aria-label="Loading" /></div> :
                    courses.length ? courses.map(item => (
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

            <Pagination pagination={data?.pagination} />
        </>
    )
}