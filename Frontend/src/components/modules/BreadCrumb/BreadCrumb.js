import "./BreadCrumb.css"
import { Link } from 'react-router-dom'

export default function BreadCrumb({ links }) {
    return (
        <nav aria-label="breadcrumb" className='page-breadcrumb'>
            <span className="page-breadcrumb__home" aria-hidden="true">
                <i className="fas fa-home"></i>
            </span>
            <ol className="breadcrumb mb-0">
                {links.map((link, index) => (
                    <li key={index}
                        className={`breadcrumb-item ${index === links.length - 1 ? "active" : ""}`}
                        aria-current={index === links.length - 1 ? "page" : undefined}>
                        <Link to={`${link.to}`}>{link.title}</Link>
                    </li>
                ))}
            </ol>
        </nav>
    )
}
