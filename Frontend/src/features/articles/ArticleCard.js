import { Link } from "react-router-dom"
import { FaArrowRight } from "react-icons/fa6"
import { CourseCover } from "../courses/CourseCard"

export default function ArticleCard({ title, description, shortName, cover }) {
    return (
        <article className="card card-hover h-100 shadow-sm overflow-hidden">
            <CourseCover cover={cover} />
            <div className="card-body d-flex flex-column">
                <h3 className="card-title h5 fw-bold">
                    <Link to={`/article-info/${shortName}`} className="link-body-emphasis stretched-link">{title}</Link>
                </h3>
                <p className="card-text text-body-secondary small mb-0">
                    {description?.length > 110 ? `${description.slice(0, 110)}…` : description}
                </p>
            </div>
            <div className="card-footer bg-transparent d-flex align-items-center justify-content-between small fw-medium text-primary">
                Read article <FaArrowRight />
            </div>
        </article>
    )
}