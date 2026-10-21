import { Link } from "react-router-dom"

/* links: [{ title, to }] — the last one is the current page */
export default function BreadCrumb({ links }) {
    return (
        <nav aria-label="breadcrumb">
            <ol className="breadcrumb small mb-0">
                {links.map((link, index) => {
                    const isLast = index === links.length - 1
                    return isLast ?
                        <li key={index} className="breadcrumb-item active" aria-current="page">{link.title}</li> :
                        <li key={index} className="breadcrumb-item">
                            <Link to={link.to} className="link-body-emphasis">{link.title}</Link>
                        </li>
                })}
            </ol>
        </nav>
    )
}
