import React, { useEffect, useState } from 'react'
import "./Navbar.css"
import { Link } from 'react-router-dom'


export default function Navbar({ email, phone }) {
  const [navbarData, setNavbarData] = useState([])

  useEffect(() => {
    fetch(`http://localhost:4000/v1/menus`)
      .then(res => res.json())
      .then(data => {
        setNavbarData(data)
      })
  }, [])

  return (
    <>
      <div className='main-header'>
        <div className="container-fluid">
          <div className="main-header__content">
            <div className="main-header__left">
              <div className='main-header_logo'>
                <Link to={"/"}>ACADEMIA</Link>
                <span>Online Education & Learning</span>
              </div>
              <div className='main-header_information'>
                <div className="main-header__email">
                  <i className="fas fa-envelope top-bar__email-icon"></i>
                  <Link to={"/"} className="main-header__email-text main-header__link">
                    {email}
                  </Link>
                </div>
                <div className="main-header__phone">
                  <i className="fas fa-phone main-header__phone-icon"></i>
                  <Link to={"/"} className="main-header__phone-text main-header__link">
                    {phone}
                  </Link>
                </div>
                <Link to={"/contact-Us"} className="main-header__contact">
                  Cantact
                </Link>
              </div>
            </div>
            <div className="main-header__right">
              <ul className="main-header__menu">
                <Link to={"/"} className="main-header__item">
                  Home
                </Link>
                {navbarData.map((item, index) => (

                  item.submenus.length ?
                    <div key={index} className="main-header__item">
                      <Link key={index} to={`/category-info/${item.href}/1`}
                       >{item.title}
                      </Link>
                      <i className="fas fa-angle-down main-header__link-icon" />
                      <ul className="main-header__dropdown">
                        {item.submenus.map(sub => (
                          <Link key={sub._id}
                            to={`/course-info/${sub.href}/1`}
                            className="main-header__dropdown-item">{sub.title}</Link>
                        ))}
                      </ul>
                    </div>
                    :
                    <Link key={index} to={`/category-info/${item.href}/1`}
                      className="main-header__item">{item.title}
                    </Link>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}



