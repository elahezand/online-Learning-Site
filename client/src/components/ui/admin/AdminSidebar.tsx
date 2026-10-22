import type { ReactNode } from "react"
import { NavLink, useNavigate } from "react-router-dom"
import Offcanvas from "react-bootstrap/Offcanvas"
import {
    FaAnglesLeft, FaAnglesRight, FaBars, FaComments, FaGraduationCap, FaHouse, FaLayerGroup, FaMessage, FaNewspaper,
    FaPercent, FaRightFromBracket, FaTicket, FaTicketSimple, FaUsers, FaVideo,
} from "react-icons/fa6"
import { useAuth } from "../../../features/auth/useAuth"
import { useTickets } from "../../../features/tickets/hooks"
import { isAnswered, isTopLevel } from "../../../features/tickets/ticketView"
import { useComments } from "../../../features/comments/hooks"
import { useContacts } from "../../../features/contacts/hooks"

interface NavItem {
    to: string
    label: string
    icon: ReactNode
    end?: boolean
    match?: string
}

const groups: { title: string; items: NavItem[] }[] = [
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

interface AdminSidebarProps {
    show: boolean
    onHide: () => void
    collapsed: boolean
    onToggle: () => void
}

export default function AdminSidebar({ show, onHide, collapsed, onToggle }: AdminSidebarProps) {
    const text = collapsed ? "d-lg-none" : ""
    const { logout } = useAuth()
    const navigate = useNavigate()
    const { data: tickets = [] } = useTickets()
    const { data: comments = [] } = useComments()
    const { data: contacts = [] } = useContacts()

    const badges: Record<string, number> = {
        tickets: tickets.filter(ticket => isTopLevel(ticket) && !isAnswered(ticket)).length,
        comments: comments.filter(comment => !comment.answer).length,
        contacts: contacts.filter(contact => !contact.answer).length,
    }

    const exitPanel = async () => {
        await logout()
        navigate("/login")
    }

    // Paginated pages (users/1, users/2 …) keep their menu item active
    const linkClass = (item: NavItem) => ({ isActive }: { isActive: boolean }) => {
        const active = isActive || (item.match && window.location.pathname.startsWith(item.match))
        return `nav-link d-flex align-items-center gap-3 position-relative ${collapsed ? "justify-content-lg-center" : ""} ${active ? "active" : "link-body-emphasis"}`
    }

    return (
        <Offcanvas show={show} onHide={onHide} responsive="lg" placement="start" className="admin-sidebar" aria-labelledby="admin-sidebar-title">
            <Offcanvas.Header closeButton className="border-bottom">
                <Offcanvas.Title id="admin-sidebar-title" className="fw-bold text-primary">ACADEMIA</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body className="p-3 p-lg-0">
                <div className="card shadow-sm w-100">
                    <div className={`card-body d-grid gap-4 ${collapsed ? "p-lg-2" : ""}`}>
                        <button type="button" onClick={onToggle}
                            className={`btn btn-sm btn-outline-secondary d-none d-lg-inline-flex align-items-center gap-2 ${collapsed ? "justify-content-center" : "ms-auto"}`}
                            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"} title={collapsed ? "Expand sidebar" : "Collapse sidebar"}>
                            {collapsed ? <FaAnglesRight /> : <><FaAnglesLeft /> Collapse</>}
                        </button>
                        {groups.map(group => (
                            <nav key={group.title} aria-label={group.title}>
                                <h3 className={`small text-uppercase fw-bold text-body-secondary px-3 mb-2 ${text}`}>{group.title}</h3>
                                <ul className="nav nav-pills flex-column gap-1">
                                    {group.items.map(item => (
                                        <li key={item.label} className="nav-item">
                                            <NavLink to={item.to} end={item.end} onClick={onHide} className={linkClass(item)} title={collapsed ? item.label : undefined}>
                                                {item.icon}<span className={text}>{item.label}</span>
                                                {badges[item.to] ?
                                                    <span className={`badge rounded-pill text-bg-danger ms-auto ${collapsed ? "admin-sidebar__badge" : ""}`}
                                                        aria-label={`${badges[item.to]} new`}>{badges[item.to]}</span> : null}
                                            </NavLink>
                                        </li>
                                    ))}
                                </ul>
                            </nav>
                        ))}

                        <button type="button" className="btn btn-outline-danger d-flex align-items-center justify-content-center gap-2" onClick={exitPanel}
                            title={collapsed ? "Log out" : undefined}>
                            <FaRightFromBracket /><span className={text}>Log out</span>
                        </button>
                    </div>
                </div>
            </Offcanvas.Body>
        </Offcanvas>
    )
}