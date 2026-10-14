import "./Footer.css"
import { Link } from 'react-router-dom'

const recentPosts = Array(5).fill("How to install a library in Python|Tutorial on installing Python libraries")
const quickLinks = ["Contact Us", "Pricing", "Terms & Conditions", "Privacy", "Feedbacks"]

export default function Footer() {
    return (
        <footer className='site-footer bg-sunken mt-5'>
            <div className="container py-5">
                <div className="row g-4 g-lg-5">
                    <div className='col-12 col-md-6 col-lg-3'>
                        <Link to={"/"} className='d-inline-flex flex-column mb-3'>
                            <span className="site-footer__logo">ACADEMIA</span>
                            <span className="small text-primary-strong">Online Education & Learning</span>
                        </Link>
                        <p className="text-body-secondary">A small river named Duden flows by their place and supplies it with the necessary regelialia.</p>
                        <ul className='list-unstyled d-flex gap-2 mt-3 mb-0'>
                            <li>
                                <Link to={"#"} className="site-footer__social" aria-label="Facebook">
                                    <i className="fa-brands fa-facebook-f"></i>
                                </Link>
                            </li>
                            <li>
                                <Link to={"#"} className="site-footer__social" aria-label="Twitter">
                                    <i className="fa-brands fa-twitter"></i>
                                </Link>
                            </li>
                            <li>
                                <Link to={"#"} className="site-footer__social" aria-label="Instagram">
                                    <i className="fa-brands fa-instagram"></i>
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div className='col-12 col-md-6 col-lg-4'>
                        <h2 className="site-footer__title">Recent posts</h2>
                        <ul className="list-unstyled d-flex flex-column gap-2 mb-0">
                            {recentPosts.map((post, index) => (
                                <li key={index}>
                                    <Link to={"#"} className="site-footer__link">{post}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className='col-12 col-md-6 col-lg-2'>
                        <h2 className="site-footer__title">Quick Links</h2>
                        <ul className="list-unstyled d-flex flex-column gap-2 mb-0">
                            {quickLinks.map(link => (
                                <li key={link}>
                                    <Link to={"#"} className="site-footer__link">
                                        <i className="fa-solid fa-arrow-right me-2 text-primary-strong"></i>{link}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className='col-12 col-md-6 col-lg-3'>
                        <h2 className="site-footer__title">Have a Questions?</h2>
                        <ul className="list-unstyled d-flex flex-column gap-3 mb-0">
                            <li className="d-flex gap-3">
                                <i className="fa-solid fa-map text-primary-strong mt-1"></i>
                                <span className="text-body-secondary">203 Fake St. Mountain View, San Francisco, California, USA</span>
                            </li>
                            <li>
                                <Link to={"#"} className="site-footer__link d-flex gap-3">
                                    <i className="fa-solid fa-phone text-primary-strong mt-1"></i>
                                    <span>+2 392 3929 210</span>
                                </Link>
                            </li>
                            <li>
                                <Link to={"#"} className="site-footer__link d-flex gap-3">
                                    <i className='fa fa-paper-plane text-primary-strong mt-1'></i>
                                    <span>info@yourdomain.com</span>
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <div className="border-top">
                <div className="container py-3 small text-body-secondary text-center">
                    © {new Date().getFullYear()} ACADEMIA. All rights reserved.
                </div>
            </div>
        </footer>
    )
}
