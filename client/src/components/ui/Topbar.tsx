import { Link } from "react-router-dom"
import { FaEnvelope, FaPhone } from "react-icons/fa6"
import { useTopbarMenu } from "../../features/menus/hooks"
import { useIndexInfo } from "../../features/info/hooks"

export default function Topbar() {
    const { data: info = {} } = useIndexInfo()
    const { data: menu } = useTopbarMenu()
    const quickLinks = (menu ?? []).slice(0, 5)

    return (
        <div className="bg-body border-bottom small d-none d-lg-block">
            <div className="container d-flex align-items-center justify-content-between gap-3 py-2">
                <div className="d-flex align-items-center gap-4 text-body-secondary">
                    {info.email &&
                        <a href={`mailto:${info.email}`} className="link-secondary d-inline-flex align-items-center gap-2">
                            <FaEnvelope className="text-primary" /> {info.email}
                        </a>}
                    {info.phone &&
                        <a href={`tel:${info.phone}`} className="link-secondary d-inline-flex align-items-center gap-2">
                            <FaPhone className="text-primary" /> {info.phone}
                        </a>}
                </div>

                <nav className="d-flex align-items-center gap-3" aria-label="Quick links">
                    {quickLinks.map(item => (
                        <Link key={item._id} to={`/course-info/${item.href}`} className="link-secondary text-nowrap">
                            {item.title}
                        </Link>
                    ))}
                </nav>
            </div>
        </div>
    )
}
