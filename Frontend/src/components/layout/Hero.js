import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { FaBookOpen, FaGraduationCap, FaMagnifyingGlass, FaRegNewspaper, FaStopwatch } from "react-icons/fa6"
import { useIndexInfo } from "../../features/info/hooks"
import { useSearch } from "../../features/search/hooks"
import useDebouncedValue from "../../hooks/useDebouncedValue"

export default function Hero({ image }) {
    const navigate = useNavigate()
    const [value, setValue] = useState("")
    const query = useDebouncedValue(value.trim(), 300)
    const { data: info = {} } = useIndexInfo()
    const { data: result } = useSearch(query)

    const suggestions = value.trim() && query && result
        ? [...(result.allResultCourses ?? []), ...(result.allResultArticles ?? [])].slice(0, 6)
        : []

    const stats = [
        { icon: <FaGraduationCap />, count: info.usersCount, label: "Students" },
        { icon: <FaBookOpen />, count: info.coursesCount, label: "Courses" },
        { icon: <FaStopwatch />, count: info.totalTime, label: "Minutes of content" },
    ]

    const submit = (e) => {
        e.preventDefault()
        if (value.trim()) navigate(`/search/${encodeURIComponent(value.trim())}`)
    }

    return (
        <section className="position-relative overflow-hidden d-flex align-items-center" data-bs-theme="dark"
            style={{ background: `url(${image}) center 20% / cover no-repeat`,minHeight:"130vh" }}>
            <div className="position-absolute top-0 start-0 w-100 h-100 bg-black banner-overlay" />
            <div className="container position-relative py-5 text-center">
                <div className="py-4 py-lg-5 my-lg-4 mx-auto col-lg-9 col-xl-8">
                    <span className="badge rounded-pill text-bg-primary px-3 py-2 mb-3">Online Education &amp; Learning</span>
                    <h1 className="display-4 fw-bold text-white mb-3">
                        We do not create courses at the expense of quality
                    </h1>
                    <p className="lead text-white text-opacity-75 mb-4">Learn to code and advance at ACADEMIA</p>

                    <form className="position-relative mx-auto col-md-10" onSubmit={submit} role="search">
                        <div className="input-group input-group-lg shadow-lg">
                            <input
                                type="search"
                                className="form-control"
                                placeholder="Search courses and articles…"
                                aria-label="Search courses and articles"
                                value={value}
                                onChange={(e) => setValue(e.target.value)} />
                            <button type="submit" className="btn btn-primary px-4" aria-label="Search">
                                <FaMagnifyingGlass />
                            </button>
                        </div>

                        {suggestions.length > 0 &&
                            <div className="list-group position-absolute start-0 end-0 mt-2 shadow-lg text-start z-3">
                                {suggestions.map(item => (
                                    <Link
                                        key={item._id}
                                        to={item.name ? `/course-info/${item.shortName}` : `/article-info/${item.shortName}`}
                                        className="list-group-item list-group-item-action d-flex align-items-center gap-2">
                                        {item.name ? <FaGraduationCap className="text-primary" /> : <FaRegNewspaper className="text-primary" />}
                                        <span className="text-truncate">{item.name ?? item.title}</span>
                                    </Link>
                                ))}
                            </div>}
                    </form>

                    <div className="row row-cols-3 g-2 g-md-4 mt-4 mt-md-5">
                        {stats.map(stat => (
                            <div className="col" key={stat.label}>
                                <div className="fs-2 text-primary-emphasis mb-1">{stat.icon}</div>
                                <div className="fs-4 fw-bold text-white">{stat.count?.toLocaleString() ?? "—"}</div>
                                <div className="small text-white text-opacity-75">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}