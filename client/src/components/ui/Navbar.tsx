import { Link, NavLink } from "react-router-dom"
import BsNavbar from "react-bootstrap/Navbar"
import Nav from "react-bootstrap/Nav"
import NavDropdown from "react-bootstrap/NavDropdown"
import Offcanvas from "react-bootstrap/Offcanvas"
import { FaCartShopping, FaRightToBracket, FaUser } from "react-icons/fa6"
import { useMainMenu } from "../../features/menus/hooks"
import { useAuth } from "../../features/auth/useAuth"
import ThemeToggle from "./ThemeToggle"
import useCart from "../../features/cart/useCart"

export default function Navbar() {
    const { data: menu = [] } = useMainMenu()
    const { isLoggedIn, userInfo } = useAuth()
    const { count } = useCart()

    return (
        <BsNavbar expand="lg" sticky="top" className="bg-body border-bottom shadow-sm" collapseOnSelect>
            <div className="container">
                <BsNavbar.Brand as={Link} to="/" className="fs-4 fw-bold text-primary me-lg-4">
                    ACADEMIA
                </BsNavbar.Brand>

                <div className="d-flex align-items-center gap-2 order-lg-last ms-auto ms-lg-3">
                    <ThemeToggle />
                    <Link to="/cart" className="btn btn-outline-secondary position-relative p-2 lh-1" aria-label={`Cart, ${count} ${count === 1 ? "course" : "courses"}`} title="Cart">
                        <FaCartShopping />
                        {count > 0 &&
                            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill text-bg-primary">{count}</span>}
                    </Link>
                    {isLoggedIn ?
                        <Link to="/my-account" className="btn btn-outline-primary d-inline-flex align-items-center gap-2">
                            <FaUser />
                            <span className="d-none d-md-inline">{userInfo.username || userInfo.name}</span>
                        </Link> :
                        <Link to="/login" className="btn btn-primary d-inline-flex align-items-center gap-2">
                            <FaRightToBracket />
                            <span className="d-none d-md-inline">Login</span>
                        </Link>}
                    <BsNavbar.Toggle aria-controls="main-nav" className="ms-1 py-1 px-2 fs-6" />
                </div>

                <BsNavbar.Offcanvas id="main-nav" placement="end" aria-labelledby="main-nav-title">
                    <Offcanvas.Header closeButton className="border-bottom">
                        <Offcanvas.Title id="main-nav-title" className="fw-bold text-primary">ACADEMIA</Offcanvas.Title>
                    </Offcanvas.Header>
                    <Offcanvas.Body>
                        <Nav className="gap-lg-1 fw-medium">
                            <Nav.Link as={NavLink} to="/" end>Home</Nav.Link>
                            {menu.map(item => item.submenus?.length ?
                                <NavDropdown key={item._id} title={item.title} id={`menu-${item._id}`}>
                                    <NavDropdown.Item as={Link} to={`/category-info/${item.href}`}>
                                        All {item.title}
                                    </NavDropdown.Item>
                                    <NavDropdown.Divider />
                                    {item.submenus.map(sub => (
                                        <NavDropdown.Item key={sub._id} as={Link} to={`/course-info/${sub.href}`}>
                                            {sub.title}
                                        </NavDropdown.Item>
                                    ))}
                                </NavDropdown> :
                                <Nav.Link key={item._id} as={NavLink} to={`/category-info/${item.href}`}>
                                    {item.title}
                                </Nav.Link>
                            )}
                            <Nav.Link as={NavLink} to="/contact-Us">Contact</Nav.Link>
                        </Nav>
                    </Offcanvas.Body>
                </BsNavbar.Offcanvas>
            </div>
        </BsNavbar>
    )
}
