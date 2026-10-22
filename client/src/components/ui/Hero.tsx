import { useState } from "react"
import type { FormEvent } from "react"
import { Link, useNavigate } from "react-router-dom"
import { FaArrowRight, FaGraduationCap, FaHeadset, FaMagnifyingGlass, FaRegNewspaper, FaUsers } from "react-icons/fa6"
import { useIndexInfo } from "../../features/info/hooks"
import { useSearch } from "../../features/search/hooks"
import { useCategories } from "../../features/categories/hooks"
import useDebouncedValue from "../../hooks/useDebouncedValue"
import type { Category } from "../../types/models"

const NO_CATEGORIES: Category[] = []

export default function Hero({ image }: { image: string }) {
    const navigate = useNavigate()
    const [value, setValue] = useState("")
    const query = useDebouncedValue(value.trim(), 300)
    const { data: info = {} } = useIndexInfo()
    const { data: result } = useSearch(query)
    const { data: categories = NO_CATEGORIES } = useCategories()

    const suggestions = value.trim() && query && result
        ? [
            ...(result.allResultCourses ?? []).map(course => ({ _id: course._id, label: course.name, to: `/course-info/${course.shortName}`, isCourse: true })),
            ...(result.allResultArticles ?? []).map(article => ({ _id: article._id, label: article.title, to: `/article-info/${article.shortName}`, isCourse: false })),
        ].slice(0, 6)
        : []

    const stats = [
        { count: info.coursesCount, label: "Courses" },
        { count: info.totalTime, label: "Minutes of content" },
        { count: categories.length || undefined, label: "Categories" },
    ]

    const submit = (e: FormEvent) => {
        e.preventDefault()
        if (value.trim()) navigate(`/search/${encodeURIComponent(value.trim())}`)
    }

    return (
        <section className="hero position-relative overflow-hidden">
            <div className="m-5 position-relative">
                <div className="hero__inner row align-items-center gy-5 gx-lg-5 py-5">
                    <div className="col-lg-6 text-center text-lg-start">
                        <span className="badge rounded-pill bg-primary-subtle text-primary-emphasis border border-primary-subtle px-3 py-2 mb-4 d-inline-flex align-items-center gap-2">
                            <FaGraduationCap /> Online Education &amp; Learning
                        </span>

                        <h1 className="display-4 fw-bold text-body-emphasis lh-sm mb-3">
                            We don't create courses at the expense of <span className="text-primary">quality</span>
                        </h1>
                        <p className="lead text-body-secondary mb-4 col-xl-11 mx-auto mx-lg-0">
                            Learn to code with project-based courses and a team that answers your questions. Start for free, learn at your own pace.
                        </p>

                        <form className="position-relative col-xl-11 mx-auto mx-lg-0" onSubmit={submit} role="search">
                            <div className="input-group input-group-lg shadow rounded-pill">
                                <span className="input-group-text bg-body border-end-0 rounded-start-pill ps-4 text-body-secondary">
                                    <FaMagnifyingGlass />
                                </span>
                                <input
                                    type="search"
                                    className="form-control border-start-0 ps-2"
                                    placeholder="Search courses and articles…"
                                    aria-label="Search courses and articles"
                                    value={value}
                                    onChange={(e) => setValue(e.target.value)} />
                                <button type="submit" className="btn btn-primary rounded-end-pill px-4 fw-semibold">Search</button>
                            </div>

                            {suggestions.length > 0 &&
                                <div className="list-group position-absolute start-0 end-0 mt-2 shadow-lg text-start z-3 rounded-4">
                                    {suggestions.map(item => (
                                        <Link
                                            key={item._id}
                                            to={item.to}
                                            className="list-group-item list-group-item-action d-flex align-items-center gap-2 py-2">
                                            {item.isCourse ? <FaGraduationCap className="text-primary flex-shrink-0" /> : <FaRegNewspaper className="text-primary flex-shrink-0" />}
                                            <span className="text-truncate">{item.label}</span>
                                            <span className="ms-auto small text-body-secondary">{item.isCourse ? "Course" : "Article"}</span>
                                        </Link>
                                    ))}
                                </div>}
                        </form>

                        {categories.length > 0 &&
                            <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start gap-2 mt-3">
                                <span className="small text-body-secondary me-1">Popular:</span>
                                {categories.slice(0, 4).map(category => (
                                    <Link key={category._id} to={`/category-info/${category.name}`}
                                        className="btn btn-sm btn-outline-secondary rounded-pill px-3">
                                        {category.title}
                                    </Link>
                                ))}
                            </div>}

                        <div className="d-flex justify-content-center justify-content-lg-start mt-5">
                            {stats.map((stat, index) => (
                                <div key={stat.label} className={`px-3 px-sm-4 ${index ? "border-start" : "ps-lg-0"}`}>
                                    <div className="fs-3 fw-bold text-body-emphasis lh-sm">{stat.count?.toLocaleString() ?? "—"}</div>
                                    <div className="small text-body-secondary">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="col-lg-6">
                        <div className="hero__photo-wrap">
                            <img src={image} alt="A student learning on her laptop"
                                className="hero__photo w-100 rounded-5 shadow-lg" fetchPriority="high" />

                            <div className="hero__chip hero__chip--top card border-0 shadow rounded-4">
                                <div className="card-body d-flex align-items-center gap-3 py-2 px-3">
                                    <span className="d-inline-flex align-items-center justify-content-center rounded-circle bg-primary text-white p-2 lh-1"><FaHeadset /></span>
                                    <div>
                                        <div className="fw-semibold text-body-emphasis small">Questions?</div>
                                        <div className="small text-body-secondary">Our team answers your tickets</div>
                                    </div>
                                </div>
                            </div>

                            <div className="hero__chip hero__chip--bottom card border-0 shadow rounded-4">
                                <div className="card-body d-flex align-items-center gap-3 py-2 px-3">
                                    <span className="d-inline-flex align-items-center justify-content-center rounded-circle bg-primary-subtle text-primary-emphasis p-2 lh-1 fs-5"><FaUsers /></span>
                                    <div>
                                        <div className="fw-bold text-body-emphasis lh-sm">{info.usersCount?.toLocaleString() ?? "—"}</div>
                                        <div className="small text-body-secondary">Students learning</div>
                                    </div>
                                    <Link to="/register" className="btn btn-sm btn-primary rounded-pill ms-2 d-inline-flex align-items-center gap-1">
                                        Join <FaArrowRight />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
