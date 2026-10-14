import { Link } from 'react-router-dom'

export default function Pageination({ data, pathName, pageCount, currentPage }) {
    if (!data.length || pageCount < 1) return null

    return (
        <nav aria-label="Pagination" className="my-4">
            <ul className="pagination justify-content-center flex-wrap gap-1 mb-0">
                {Array(pageCount).fill(0).map((item, index) => {
                    const isActive = String(index + 1) === String(currentPage)
                    return (
                        <li key={index + 1} className={`page-item ${isActive ? "active" : ""}`}>
                            <Link
                                to={`${pathName}/${index + 1}`}
                                className="page-link rounded"
                                aria-current={isActive ? "page" : undefined}>
                                {index + 1}
                            </Link>
                        </li>
                    )
                })}
            </ul>
        </nav>
    )
}
