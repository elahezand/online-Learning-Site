import { useContext } from 'react'
import "./Sidebar.css"
import authContext from '../../../../context/authContext.js';
import { FaChartLine } from "react-icons/fa";
import { useLocation } from 'react-router-dom';
import { GiChart } from "react-icons/gi";
import { Link, useNavigate } from 'react-router-dom';
export default function Sidebar() {
    const AuthoContext = useContext(authContext)
    const navigate = useNavigate()
    const pathname = useLocation().pathname

    const exitPanel = () => {
        AuthoContext.logout()
        navigate("/login")
    }
    return (
        <div className='col-2'>
            <div className='sidebarWrapper'>
                <ul className='dashboard'>
                    <h3 className='dashboard-title'>Dashboard</h3>
                    <li className={`dashboard-item
                    ${pathname === "/p-admin" && "active"}`}>
                        <i className='fa fa-home'></i>
                        <Link to="" className='link'>
                            Home
                        </Link>
                    </li>
                    <li className={`dashboard-item 
                    ${pathname.includes("/analystic") && "active"}`}>
                        <FaChartLine></FaChartLine>
                        <Link className='link'>
                            Analystic
                        </Link>
                    </li>
                    <li className={`dashboard-item
                    ${pathname.includes("/sales") && "active"}`}>
                        <GiChart></GiChart>
                        <Link className='link'>
                            Sales
                        </Link>
                    </li>
                </ul>
                <ul className='QuickMenu'>
                    <h3 className='QuickMenu-title'>QuickMenu</h3>
                    <li className={`QuickMenu-item ${pathname.includes("users") && 'active'}`}>
                        <i className='fa fa-users'></i>
                        <Link className='link' to="users/1">
                            Users
                        </Link>
                    </li>
                    <li className={`QuickMenu-item ${pathname.includes("new-user") && 'active'}`}>
                        <i className="fa-solid fa-user-plus"></i>
                        <Link className='link' to="new-user">
                            New Users
                        </Link>
                    </li>
                    <li className={`QuickMenu-item ${pathname.includes("courses") && 'active'}`}>
                        <i className="fa-solid fa-graduation-cap"></i>
                        <Link to="courses/1" className='link'>
                            Courses
                        </Link>
                    </li>
                    <li className={`QuickMenu-item ${pathname.includes("categories") && 'active'}`}>
                        <i className='fa fa-layer-group'></i>
                        <Link className='link' to="categories/1">
                            Categories
                        </Link>
                    </li>
                    <li className={`QuickMenu-item ${pathname.includes("articles") && 'active'}`}>
                        <i className="fa-solid fa-newspaper"></i>
                        <Link className='link' to={"articles/1"}>
                            Articles
                        </Link>
                    </li>

                    <li className={`QuickMenu-item ${pathname.includes("sessions") && 'active'}`}>
                        <i className="fa-solid fa-video"></i>
                        <Link className='link' to={"sessions/1"}>
                            Sessions
                        </Link>
                    </li>
                </ul>

                <ul className='Notifications'>
                    <h3 className='Notifications-title'>Notifications</h3>
                    <li className='Notifications-item'>
                        <i className="fa-solid fa-comments"></i>
                        <Link className='link' to={"comments/1"}>
                            Comments
                        </Link>
                    </li>
                    <li className='QuickMenu-item'>
                        <i className="fa-solid fa-message"></i>
                        <Link className='link' to={"contacts/1"}>
                            Messages
                        </Link>
                    </li>
                    <li className='QuickMenu-item'>
                        <i className="fa-solid fa-ticket"></i>
                        <Link className='link' to={"tickets/1"}>
                            Tickets
                        </Link>
                    </li>
                </ul>

                <ul className='Staff'>
                    <h3 className='Staff-title'>Staff</h3>
                    <li className='Staff-item'>
                        <i className="fa-solid fa-bars"></i>
                        <Link className='link' to={"menu"}>
                            Menu
                        </Link>
                    </li>
                    <li className='Staff-item'>
                        <i className='fas fa-ticket-alt'></i>
                        <Link className='link' to={"discounts/1"}>
                            Discounts
                        </Link>
                    </li>
                    <li className='Staff-item'>
                        <i className='fas fa-ticket-alt'></i>
                        <Link className='link' to={"sitewide-discounts"}>
                            SiteWide-Discounts
                        </Link>
                    </li>
                    <li className='Staff-item' onClick={() => exitPanel()}>
                        <i className="fa-solid fa-right-from-bracket"></i>
                        Exit
                    </li>
                </ul>
            </div>
        </div>
    )
}
