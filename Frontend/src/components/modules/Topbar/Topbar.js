import { useMemo } from 'react'
import "./Topbar.css"
import { useAuth } from '../../../context/AuthContext'
import { Link } from 'react-router-dom';
import { useTopbarMenu } from '../../../api';
import ThemeToggle from '../ThemeToggle/ThemeToggle';


export default function Topbar() {
    const AuthContext = useAuth()
    const { data: menu } = useTopbarMenu()
    const topbarMenu = useMemo(
        () => (menu ? [...menu].sort(() => 0.5 - Math.random()).slice(0, 5) : []),
        [menu])

    return (
        <div className='top-bar bg-surface border-bottom'>
            <div className="container-fluid px-3 px-lg-4">
                <div className="d-flex align-items-center justify-content-between gap-3 py-2">
                    <div className="d-flex align-items-center gap-2 flex-shrink-0">
                        {AuthContext.isLoggedIn ?
                            <Link to="/my-account/" className="btn btn-outline-primary btn-sm text-truncate top-bar__profile">
                                <i className="fa-solid fa-user me-2"></i>
                                {AuthContext.userInfo.username}
                            </Link> :
                            <Link to="/register" className="btn btn-outline-primary btn-sm top-bar__profile">
                                <i className="fa-solid fa-right-to-bracket me-2"></i>
                                <span className="d-none d-sm-inline">Login / Register</span>
                                <span className="d-sm-none">Login</span>
                            </Link>}

                        <Link to="#" className="icon-btn" aria-label="Search">
                            <i className="fas fa-search"></i>
                        </Link>
                        <Link to="#" className="icon-btn" aria-label="Cart">
                            <i className="fas fa-shopping-cart"></i>
                        </Link>
                        <ThemeToggle />
                    </div>

                    <nav className="top-bar__menu d-flex align-items-center gap-1 overflow-auto min-w-0" aria-label="Quick links">
                        {topbarMenu.map(item => (
                            <Link to={`/course-info/${item.href}/1`} key={item._id}
                                className="top-bar__link text-nowrap">
                                {item.title}
                            </Link>))}
                    </nav>
                </div>
            </div>
        </div>
    )
}
