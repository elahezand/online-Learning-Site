import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const shortcuts = [
    { to: "orders/1", label: "Orders", icon: "fa-solid fa-bag-shopping" },
    { to: "courses/1", label: "Bought Courses", icon: "fa-solid fa-graduation-cap" },
    { to: "wallet", label: "Wallet", icon: "fa-solid fa-wallet" },
    { to: "detail", label: "Detail Account", icon: "fa-solid fa-user-gear" },
    { to: "tickets/1", label: "Tickets", icon: "fa-solid fa-ticket" },
]

export default function UserPanelIndex() {
    const AuthContext = useAuth()

    return (
        <div>
            <h1 className="h4 mb-2">
                Hello, <span className="text-primary-strong">{AuthContext.userInfo.name}</span>
            </h1>
            <p className="text-body-secondary mb-4">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Sit nulla quidem quae maxime at! In, nobis nulla quia delectus voluptas,
                repudiandae explicabo dolorum inventore ipsam fuga ratione adipisci nam facilis?
            </p>
            <div className="row row-cols-1 row-cols-sm-2 row-cols-xl-3 g-3">
                {shortcuts.map(item => (
                    <div className="col" key={item.to}>
                        <Link to={item.to} className="surface hover-lift d-flex align-items-center gap-3 p-3 h-100 text-heading">
                            <span className="icon-badge"><i className={item.icon}></i></span>
                            <span className="fw-medium">{item.label}</span>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    )
}
