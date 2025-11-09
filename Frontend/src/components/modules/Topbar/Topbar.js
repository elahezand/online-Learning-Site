import React, { useContext, useEffect, useState } from 'react'
import "./Topbar.css"
import authContext from '../../../context/authContext.js';
import { Link } from 'react-router-dom';


export default function Topbar() {
    const AuthContext = useContext(authContext)    
    const [topbarMenu, setTopbatMenu] = useState([])

    useEffect(() => {
        fetch(`http://localhost:4000/v1/menus/topbar`)
            .then(res => res.json())
            .then(data => {
                setTopbatMenu(data.sort(() => 0.5 - Math.random()).slice(0, 5))
            })
    }, [])
    return (
        <div className='top-bar' >
            <div className="container-fluid">
                <div className="top-bar__content">
                    <div className="top-bar__left">
                        {AuthContext.isLoggedIn ?
                            <Link to="/my-account/" className="top-bar__profile">
                                <span className="top-bar__profile-text">{AuthContext.userInfo.username}</span>
                            </Link> :
                            <Link to="/register" className="top-bar__profile">
                                <span className="top-bar__profile-text">Login/Register</span>
                            </Link>}

                        <Link href="#" className="top-bar__search-btn">
                            <i className="fas fa-search top-bar__search-icon"></i>
                        </Link>
                        <Link href="#" className="top-bar__cart-btn">
                            <i className="fas fa-shopping-cart top-bar__cart-icon"></i>
                        </Link>

                    </div>
                    <div className="top-bar__right">
                        <ul className="top-bar__menu">
                            {topbarMenu.map(item => (
                                <Link to={`/course-info/${item.href}/1`} key={item._id}
                                    className="top-bar__item">
                                    {item.title}
                                </Link>))}
                        </ul>
                    </div>

                </div>
            </div>
        </div>
    )
}

