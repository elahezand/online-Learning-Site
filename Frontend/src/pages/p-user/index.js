import { Link } from 'react-router-dom'
import { useContext } from 'react'
import authContext from '../../context/authContext.js'
import "../../styles/p-user/index.css"

export default function UserPanelIndex() {
    const AuthContext = useContext(authContext)

    return (
        <div>
            <span className="check-user">
                <Link href="#">{AuthContext.userInfo.name}</Link>
            </span>
            <p className="user-edit">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Sit nulla quidem quae maxime at! In, nobis nulla quia delectus voluptas,
                repudiandae explicabo dolorum inventore ipsam fuga ratione adipisci nam facilis?
            </p>
            <div>
                <ul className="user-ticket">
                    <li>
                        <Link to={"orders/1"}>Orders</Link>
                    </li>
                    <li>
                        <Link to={"My-Courses/1"}>Bought Courses</Link>
                    </li>
                    <li>
                        <Link to={"wallet"}> Wallet</Link>
                    </li>
                    <li>
                        <Link to={"Detail"}>Detail Account</Link>
                    </li>
                    <li>
                        <Link to={"tickets/1"}> Tickets </Link>
                    </li>
                </ul>
            </div>
        </div>
    )
}
