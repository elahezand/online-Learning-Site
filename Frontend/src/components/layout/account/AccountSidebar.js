import { NavLink, useNavigate } from "react-router-dom"
import { FaBagShopping, FaGauge, FaGraduationCap, FaRightFromBracket, FaTicket, FaUserGear, FaWallet } from "react-icons/fa6"
import { useAuth } from "../../../features/auth/AuthContext"
import { confirmToast } from "../../ui/toastActions"

const links = [
    { to: "/my-account", label: "Dashboard", icon: <FaGauge />, end: true },
    { to: "courses", label: "My courses", icon: <FaGraduationCap />, match: "/my-account/courses" },
    { to: "orders", label: "Orders", icon: <FaBagShopping />, match: "/my-account/orders" },
    { to: "wallet", label: "Wallet", icon: <FaWallet /> },
    { to: "tickets", label: "Tickets", icon: <FaTicket />, match: "/my-account/ticket" },
    { to: "detail", label: "Account details", icon: <FaUserGear /> },
]

/* Vertical pills on desktop; a horizontally scrollable pill bar on phones */
export default function AccountSidebar() {
    const { logout } = useAuth()
    const navigate = useNavigate()

    const exitPanel = async () => {
        const ok = await confirmToast({ title: "Log out of your account?", confirmLabel: "Log out" })
        if (!ok) return
        await logout()
        navigate("/login")
    }

    const linkClass = (link) => ({ isActive }) => {
        const active = isActive || (link.match && window.location.pathname.startsWith(link.match))
        return `nav-link d-flex align-items-center gap-2 text-nowrap ${active ? "active" : "link-body-emphasis"}`
    }

    return (
        <aside className="card shadow-sm">
            <div className="card-body p-2 p-lg-3">
                <nav aria-label="Account">
                    <ul className="nav nav-pills flex-nowrap flex-lg-column gap-1 overflow-auto">
                        {links.map(link => (
                            <li className="nav-item" key={link.to}>
                                <NavLink to={link.to} end={link.end} className={linkClass(link)}>
                                    {link.icon}{link.label}
                                </NavLink>
                            </li>
                        ))}
                        <li className="nav-item mt-lg-2">
                            <button type="button" className="nav-link link-danger d-flex align-items-center gap-2 text-nowrap w-100" onClick={exitPanel}>
                                <FaRightFromBracket /> Log out
                            </button>
                        </li>
                    </ul>
                </nav>
            </div>
        </aside>
    )
}
