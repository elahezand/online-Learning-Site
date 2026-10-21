import { Link } from "react-router-dom"
import { FaAngleRight } from "react-icons/fa6"
import { useCourses } from "../courses/hooks"
import { useArticles } from "./hooks"
import { coverUrl } from "../../config/env"

const quickAccess = [
    { title: "All courses", to: "/courses" },
    { title: "Frontend", to: "/category-info/frontend" },
    { title: "Backend", to: "/category-info/backend" },
    { title: "All articles", to: "/articles" },
]

export default function ArticleSidebar() {
    const { data: courses = [] } = useCourses()
    const { data: articles = [] } = useArticles()
    const topCourses = [...courses].sort((a, b) => (b.courseAverageScore ?? 0) - (a.courseAverageScore ?? 0)).slice(0, 4)
    const newArticles = articles.filter(a => a.publish === 1).slice(0, 5)

    return (
        <aside className="d-grid gap-4">
            <section className="card shadow-sm">
                <div className="card-header py-3"><h2 className="h6 fw-bold mb-0">Top-rated courses</h2></div>
                <div className="list-group list-group-flush">
                    {topCourses.map(course => (
                        <Link key={course._id} to={`/course-info/${course.shortName}`}
                            className="list-group-item list-group-item-action d-flex align-items-center gap-3">
                            <img src={coverUrl(course.cover)} alt="" width="64" height="40" className="rounded object-fit-cover bg-body-secondary flex-shrink-0" />
                            <span className="small fw-medium text-truncate">{course.name}</span>
                        </Link>
                    ))}
                </div>
            </section>

            <section className="card shadow-sm">
                <div className="card-header py-3"><h2 className="h6 fw-bold mb-0">Quick access</h2></div>
                <div className="list-group list-group-flush">
                    {quickAccess.map(item => (
                        <Link key={item.title} to={item.to}
                            className="list-group-item list-group-item-action d-flex align-items-center justify-content-between">
                            {item.title} <FaAngleRight className="text-primary" />
                        </Link>
                    ))}
                </div>
            </section>

            {newArticles.length > 0 &&
                <section className="card shadow-sm">
                    <div className="card-header py-3"><h2 className="h6 fw-bold mb-0">New articles</h2></div>
                    <div className="list-group list-group-flush">
                        {newArticles.map(article => (
                            <Link key={article._id} to={`/article-info/${article.shortName}`}
                                className="list-group-item list-group-item-action small">
                                {article.title}
                            </Link>
                        ))}
                    </div>
                </section>}
        </aside>
    )
}
