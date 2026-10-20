import "./SideBar.css"
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../../../context/AuthContext'
import swal from 'sweetalert'

const links = [
    { to: "/my-account", label: "Dashboard", icon: "fa-solid fa-gauge", end: true },
    { to: "orders/1", label: "Orders", icon: "fa-solid fa-bag-shopping" },
    { to: "wallet", label: "My wallet", icon: "fa-solid fa-wallet" },
    { to: "detail", label: "Detail Account", icon: "fa-solid fa-user-gear" },
    { to: "courses/1", label: "Courses", icon: "fa-solid fa-graduation-cap" },
    { to: "tickets/1", label: "Tickets", icon: "fa-solid fa-ticket" },
]

export default function SideBar() {
    const AuthContext = useAuth()
    const navigate = useNavigate()
    const exitPanel = () => {
        swal({
            title: "Are you sure to be Logout?",
            icon: "warning",
            buttons: ["No", "yes"]
        }).then(result => {
            if (result) {
                AuthContext.logout()
                navigate("/login")
            }
        })
    }

    return (
        <aside className='user-sidebar surface'>
            <div className='user-sidebar__header d-flex align-items-center gap-3'>
                <span className="icon-badge"><i className="fa-solid fa-user-pen"></i></span>
                <p className="mb-0 fw-medium text-heading">Welcome to your Dashboard</p>
            </div>
            <nav aria-label="Account">
                <ul className="nav nav-pills user-sidebar__nav">
                    {links.map(link => (
                        <li className="nav-item" key={link.to}>
                            <NavLink to={link.to} end={link.end} className="nav-link">
                                <i className={`${link.icon} user-sidebar__icon`}></i>
                                {link.label}
                            </NavLink>
                        </li>
                    ))}
                    <li className="nav-item">
                        <button type="button" className='nav-link user-sidebar__exit' onClick={() => exitPanel()}>
                            <i className="fa-solid fa-right-from-bracket user-sidebar__icon"></i>
                            Exit
                        </button>
                    </li>
                </ul>
            </nav>
        </aside>
    )
}
