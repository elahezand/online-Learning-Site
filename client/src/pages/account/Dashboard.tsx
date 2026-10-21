import { Link } from "react-router-dom"
import { FaArrowRight, FaBagShopping, FaGraduationCap, FaTicket, FaUserGear, FaWallet } from "react-icons/fa6"
import { useAuth } from "../../features/auth/useAuth"

const shortcuts = [
    { to: "courses", label: "My courses", desc: "Continue where you left off", icon: <FaGraduationCap /> },
    { to: "orders", label: "Orders", desc: "Your purchase history", icon: <FaBagShopping /> },
    { to: "wallet", label: "Wallet", desc: "Balance and top-ups", icon: <FaWallet /> },
    { to: "tickets", label: "Tickets", desc: "Questions and support", icon: <FaTicket /> },
    { to: "detail", label: "Account details", desc: "Name, email and password", icon: <FaUserGear /> },
]

export default function Dashboard() {
    const { userInfo } = useAuth()

    return (
        <>
            <h2 className="h4 fw-bold mb-1">Hello, <span className="text-primary-emphasis">{userInfo.name}</span></h2>
            <p className="text-body-secondary mb-4">Here is everything about your learning in one place.</p>
            <div className="row row-cols-1 row-cols-sm-2 row-cols-xl-3 g-3">
                {shortcuts.map(item => (
                    <div className="col" key={item.to}>
                        <div className="card h-100 shadow-sm">
                            <div className="card-body d-flex align-items-center gap-3">
                                <span className="d-inline-flex align-items-center justify-content-center rounded-3 bg-primary-subtle text-primary-emphasis p-3 fs-5 lh-1 flex-shrink-0">{item.icon}</span>
                                <div className="flex-grow-1">
                                    <Link to={item.to} className="fw-bold link-body-emphasis stretched-link">{item.label}</Link>
                                    <div className="small text-body-secondary">{item.desc}</div>
                                </div>
                                <FaArrowRight className="text-body-tertiary" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    )
}
