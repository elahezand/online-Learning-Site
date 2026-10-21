import { NavLink, useNavigate } from "react-router-dom"
import Offcanvas from "react-bootstrap/Offcanvas"
import {
    FaBars, FaComments, FaGraduationCap, FaHouse, FaLayerGroup, FaMessage, FaNewspaper,
    FaPercent, FaRightFromBracket, FaTicket, FaTicketSimple, FaUserPlus, FaUsers, FaVideo,
} from "react-icons/fa6"
import { useAuth } from "../../../features/auth/AuthContext"

const groups = [
    {
        title: "Dashboard",
        items: [
            { to: "/p-admin", label: "Home", icon: <FaHouse />, end: true },
        ],
    },
    {
        title: "Content",
        items: [
            { to: "users", label: "Users", icon: <FaUsers />, match: "/p-admin/users" },
            { to: "new-user", label: "New user", icon: <FaUserPlus /> },
            { to: "courses", label: "Courses", icon: <FaGraduationCap />, match: "/p-admin/courses" },
            { to: "sessions", label: "Sessions", icon: <FaVideo />, match: "/p-admin/sessions" },
            { to: "categories", label: "Categories", icon: <FaLayerGroup />, match: "/p-admin/categories" },
            { to: "articles", label: "Articles", icon: <FaNewspaper />, match: "/p-admin/article" },
        ],
    },
    {
        title: "Inbox",
        items: [
            { to: "comments", label: "Comments", icon: <FaComments />, match: "/p-admin/comments" },
            { to: "contacts", label: "Messages", icon: <FaMessage />, match: "/p-admin/contacts" },
            { to: "tickets", label: "Tickets", icon: <FaTicket />, match: "/p-admin/tickets" },
        ],
    },
    {
        title: "Store",
        items: [
            { to: "menu", label: "Menus", icon: <FaBars />, match: "/p-admin/menu" },
            { to: "discounts", label: "Discounts", icon: <FaTicketSimple />, match: "/p-admin/discounts" },
            { to: "siteWide-discounts", label: "Site-wide discount", icon: <FaPercent /> },
        ],
    },
]

export default function AdminSidebar({ show, onHide }) {
    const { logout } = useAuth()
    const navigate = useNavigate()

    const exitPanel = async () => {
        await logout()
        navigate("/login")
    }

    // Paginated pages (users/1, users/2 …) keep their menu item active
    const linkClass = (item) => ({ isActive }) => {
        const active = isActive || (item.match && window.location.pathname.startsWith(item.match))
        return `nav-link d-flex align-items-center gap-3 ${active ? "active" : "link-body-emphasis"}`
    }

    return (
        <Offcanvas show={show} onHide={onHide} responsive="lg" placement="start" aria-labelledby="admin-sidebar-title">
            <Offcanvas.Header closeButton className="border-bottom">
                <Offcanvas.Title id="admin-sidebar-title" className="fw-bold text-primary">ACADEMIA</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body className="p-3 p-lg-0">
                <div className="card shadow-sm w-100">
                    <div className="card-body d-grid gap-4">
                        {groups.map(group => (
                            <nav key={group.title} aria-label={group.title}>
                                <h3 className="small text-uppercase fw-bold text-body-secondary px-3 mb-2">{group.title}</h3>
                                <ul className="nav nav-pills flex-column gap-1">
                                    {group.items.map(item => (
                                        <li key={item.label} className="nav-item">
                                            <NavLink to={item.to} end={item.end} onClick={onHide} className={linkClass(item)}>
                                                {item.icon}{item.label}
                                            </NavLink>
                                        </li>
                                    ))}
                                </ul>
                            </nav>
                        ))}

                        <button type="button" className="btn btn-outline-danger d-flex align-items-center justify-content-center gap-2" onClick={exitPanel}>
                            <FaRightFromBracket /> Log out
                        </button>
                    </div>
                </div>
            </Offcanvas.Body>
        </Offcanvas>
    )
}
