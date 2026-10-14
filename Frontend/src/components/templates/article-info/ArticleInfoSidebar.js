import "./ArticleInfoSidebar.css"
import { Link } from 'react-router-dom'

const topCourses = [
    { img: "/images/courses/js_project.png", title: "Lorem ipsum dolor sit amet." },
    { img: "/images/courses/fareelancer.png", title: "Lorem ipsum dolor sit amet." },
    { img: "/images/courses/nodejs.png", title: "Lorem ipsum dolor sit." },
    { img: "/images/courses/jango.png", title: "Lorem ipsum dolor sit." },
]
const quickAccess = ["Home", "Frontend", "Security", "Python", "Soft skills"]
const newArticles = Array(6).fill("How to install a library in Python|Tutorial on installing Python libraries")

export default function ArticleInfoSidebar() {
    return (
        <aside className="col-12 col-lg-4 order-2 order-lg-1">
            <div className="article-sidebar d-flex flex-column gap-3">
                <div className="card sidebar-card p-3">
                    <h2 className="sidebar-card__title">Highest-rated courses</h2>
                    <ul className="list-unstyled mb-0">
                        {topCourses.map((course, index) => (
                            <li key={index}>
                                <Link to="#" className="sidebar-course">
                                    <img src={course.img} alt="" className="sidebar-course__img" />
                                    <span>{course.title}</span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="card sidebar-card p-3">
                    <h2 className="sidebar-card__title">Quick access</h2>
                    <div className="list-group list-group-flush">
                        {quickAccess.map(item => (
                            <Link to="#" key={item}
                                className="list-group-item list-group-item-action d-flex align-items-center justify-content-between px-2">
                                {item}
                                <i className="fas fa-angle-right text-primary-strong"></i>
                            </Link>
                        ))}
                    </div>
                </div>

                <div className="card sidebar-card p-3">
                    <h2 className="sidebar-card__title">New articles</h2>
                    <ul className="list-unstyled mb-0">
                        {newArticles.map((article, index) => (
                            <li key={index} className="border-bottom py-2">
                                <Link to="#" className="sidebar-link">{article}</Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </aside>
    )
}
