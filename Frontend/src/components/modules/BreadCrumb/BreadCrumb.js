import "./BreadCrumb.css"
import { Link } from 'react-router-dom'

export default function BreadCrumb({ links }) {
    return (
        <>

            <div className='breadcrumb__content'>
                <div className="breadcrumb__home-content-icon">
                    <i className="fas fa-home breadcrumb__home-icon"></i>
                </div>
                <div className="breadcrumb__list">
                    {links.map((link, index) => (
                        <li key={index} className="breadcrumb__item">
                            <Link to={`${link.to}`} className="breadcrumb__link">
                                {link.title}
                                {link.id !== links.length && <i className="fas fa-angle-right breadcrumb__icon"></i>
                                }
                            </Link>
                        </li>
                    ))}
                </div>
            </div>

        </>
    )
}
