import "./SideBar.css"
import { Link } from 'react-router-dom'
import { useContext } from 'react'
import authContext from '../../../../context/authContext.js'
import { useNavigate } from 'react-router-dom'
import swal from 'sweetalert'

export default function SideBar() {
    const AuthContext = useContext(authContext)
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
        <div className='col-3 panel-sidebar'>
            <div className='dashboard-header'>
                <i className="fa-solid fa-user-pen"></i>
                <p className="name"> Welcome to your Dashboard </p>
            </div>
            <ul>
                <li>
                    <Link to={"/my-account"}>Dashboard</Link>
                </li>
                <li>
                    <Link to={"orders/1"}> Orders</Link>
                </li>
                <li>
                    <Link to={"wallet"}>My wallet</Link>
                </li>
                <li>
                    <Link to={"Detail"}>Detail Account</Link>
                </li>
                <li>
                    <Link to={"courses/1"}> Courses</Link>
                </li>
                <li>
                    <Link to={"tickets/1"}> Tickets </Link>
                </li>

                <button className='logout-user' onClick={() => exitPanel()}>
                    <i className="fa-solid fa-right-from-bracket"></i>
                    Exit
                </button>
            </ul>

        </div>
    )
}
