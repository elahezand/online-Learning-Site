import { Link } from "react-router-dom"

export interface Crumb {
    title: string
    to?: string
}

export default function BreadCrumb({ links }: { links: Crumb[] }) {
    return (
        <nav aria-label="breadcrumb">
            <ol className="breadcrumb small mb-0">
                {links.map((link, index) => {
                    const isLast = index === links.length - 1
                    return isLast || !link.to ?
                        <li key={index} className="breadcrumb-item active" aria-current="page">{link.title}</li> :
                        <li key={index} className="breadcrumb-item">
                            <Link to={link.to} className="link-body-emphasis">{link.title}</Link>
                        </li>
                })}
            </ol>
        </nav>
    )
}
