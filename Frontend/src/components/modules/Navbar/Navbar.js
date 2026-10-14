import { useEffect, useState } from 'react'
import "./Navbar.css"
import { Link } from 'react-router-dom'
import BsNavbar from 'react-bootstrap/Navbar'
import Container from 'react-bootstrap/Container'
import Offcanvas from 'react-bootstrap/Offcanvas'


export default function Navbar({ email, phone }) {
  const [navbarData, setNavbarData] = useState([])

  useEffect(() => {
    fetch(`http://localhost:4000/v1/menus`)
      .then(res => res.json())
      .then(data => {
        setNavbarData(data)
      })
      .catch(() => setNavbarData([]))
  }, [])

  return (
    <BsNavbar expand="lg" className='main-header' collapseOnSelect>
      <Container fluid className="px-3 px-lg-4 py-2">
        <div className="d-flex align-items-center gap-4 min-w-0">
          <Link to={"/"} className='main-header__brand'>
            <span className="main-header__logo">ACADEMIA</span>
            <span className="main-header__tagline">Online Education & Learning</span>
          </Link>

          <div className='main-header__info d-none d-xl-flex flex-column gap-1'>
            {email &&
              <span className="d-flex align-items-center gap-2">
                <i className="fas fa-envelope"></i>{email}
              </span>}
            {phone &&
              <span className="d-flex align-items-center gap-2">
                <i className="fas fa-phone"></i>{phone}
              </span>}
          </div>
        </div>

        <BsNavbar.Toggle aria-controls="main-nav" className="main-header__toggler">
          <i className="fa-solid fa-bars"></i>
        </BsNavbar.Toggle>

        <BsNavbar.Offcanvas id="main-nav" placement="end" aria-labelledby="main-nav-title">
          <Offcanvas.Header closeButton>
            <Offcanvas.Title id="main-nav-title" className="fw-bold text-primary-strong">ACADEMIA</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body className="align-items-lg-center">
            <ul className="navbar-nav ms-lg-auto gap-lg-1 main-header__menu">
              <li className="nav-item">
                <Link to={"/"} className="nav-link">Home</Link>
              </li>
              {navbarData.map((item, index) => (
                item.submenus.length ?
                  <li key={index} className="nav-item main-header__item">
                    <Link to={`/category-info/${item.href}/1`} className="nav-link d-flex align-items-center gap-1">
                      {item.title}
                      <i className="fas fa-angle-down main-header__caret" />
                    </Link>
                    <ul className="dropdown-menu main-header__dropdown">
                      {item.submenus.map(sub => (
                        <li key={sub._id}>
                          <Link to={`/course-info/${sub.href}/1`} className="dropdown-item">{sub.title}</Link>
                        </li>
                      ))}
                    </ul>
                  </li>
                  :
                  <li key={index} className="nav-item">
                    <Link to={`/category-info/${item.href}/1`} className="nav-link">{item.title}</Link>
                  </li>
              ))}
            </ul>

            <div className="d-flex flex-column flex-lg-row gap-3 mt-4 mt-lg-0 ms-lg-3">
              <div className="d-lg-none small text-body-secondary d-flex flex-column gap-2">
                {email && <span><i className="fas fa-envelope me-2"></i>{email}</span>}
                {phone && <span><i className="fas fa-phone me-2"></i>{phone}</span>}
              </div>
              <Link to={"/contact-Us"} className="btn btn-primary">
                Contact
              </Link>
            </div>
          </Offcanvas.Body>
        </BsNavbar.Offcanvas>
      </Container>
    </BsNavbar>
  )
}
