import "./Sidebar.css"
import { useAuth } from '../../../../context/AuthContext'
import { FaChartLine } from "react-icons/fa";
import { GiChart } from "react-icons/gi";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Offcanvas from 'react-bootstrap/Offcanvas';

const groups = [
    {
        title: "Dashboard",
        items: [
            { to: "", label: "Home", icon: <i className='fa fa-home'></i>, isActive: (p) => p === "/p-admin" || p === "/p-admin/" },
            { to: "#", label: "Analystic", icon: <FaChartLine />, isActive: (p) => p.includes("/analystic") },
            { to: "#", label: "Sales", icon: <GiChart />, isActive: (p) => p.includes("/sales") },
        ]
    },
    {
        title: "QuickMenu",
        items: [
            { to: "users/1", label: "Users", icon: <i className='fa fa-users'></i>, isActive: (p) => p.includes("users") },
            { to: "new-user", label: "New Users", icon: <i className="fa-solid fa-user-plus"></i>, isActive: (p) => p.includes("new-user") },
            { to: "courses/1", label: "Courses", icon: <i className="fa-solid fa-graduation-cap"></i>, isActive: (p) => p.includes("courses") },
            { to: "categories/1", label: "Categories", icon: <i className='fa fa-layer-group'></i>, isActive: (p) => p.includes("categories") },
            { to: "articles/1", label: "Articles", icon: <i className="fa-solid fa-newspaper"></i>, isActive: (p) => p.includes("articles") || p.includes("article-draft") },
            { to: "sessions/1", label: "Sessions", icon: <i className="fa-solid fa-video"></i>, isActive: (p) => p.includes("sessions") },
        ]
    },
    {
        title: "Notifications",
        items: [
            { to: "comments/1", label: "Comments", icon: <i className="fa-solid fa-comments"></i>, isActive: (p) => p.includes("comments") },
            { to: "contacts/1", label: "Messages", icon: <i className="fa-solid fa-message"></i>, isActive: (p) => p.includes("contacts") },
            { to: "tickets/1", label: "Tickets", icon: <i className="fa-solid fa-ticket"></i>, isActive: (p) => p.includes("tickets") },
        ]
    },
    {
        title: "Staff",
        items: [
            { to: "menu/1", label: "Menu", icon: <i className="fa-solid fa-bars"></i>, isActive: (p) => p.includes("menu") },
            { to: "discounts/1", label: "Discounts", icon: <i className='fas fa-ticket-alt'></i>, isActive: (p) => p.includes("/discounts") },
            { to: "siteWide-discounts", label: "SiteWide-Discounts", icon: <i className='fas fa-percent'></i>, isActive: (p) => p.toLowerCase().includes("sitewide") },
        ]
    },
]

export default function Sidebar({ show, onHide }) {
    const AuthoContext = useAuth()
    const navigate = useNavigate()
    const pathname = useLocation().pathname

    const exitPanel = () => {
        AuthoContext.logout()
        navigate("/login")
    }

    return (
        <Offcanvas show={show} onHide={onHide} responsive="lg" placement="start"
            className="admin-sidebar" aria-labelledby="admin-sidebar-title">
            <Offcanvas.Header closeButton>
                <Offcanvas.Title id="admin-sidebar-title" className="fw-bold text-primary-strong">ACADEMIA</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body className="flex-column gap-4 p-3">
                {groups.map(group => (
                    <nav key={group.title} aria-label={group.title}>
                        <h3 className='admin-sidebar__title'>{group.title}</h3>
                        <ul className="nav flex-column gap-1">
                            {group.items.map(item => (
                                <li key={item.label} className="nav-item">
                                    <Link to={item.to} onClick={onHide}
                                        className={`admin-sidebar__link ${item.isActive(pathname) ? "active" : ""}`}>
                                        <span className="admin-sidebar__icon">{item.icon}</span>
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>
                ))}
                <button type="button" className='admin-sidebar__link admin-sidebar__exit' onClick={() => exitPanel()}>
                    <span className="admin-sidebar__icon"><i className="fa-solid fa-right-from-bracket"></i></span>
                    Exit
                </button>
            </Offcanvas.Body>
        </Offcanvas>
    )
}
