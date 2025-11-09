import React from 'react'
import "./Footer.css"
import { Link } from 'react-router-dom'

export default function Footer() {
    return (
        <div className='container-footer' fluid>
            <div className="row justify-content-md-center">
                <div className='col-3' >
                    <div className='footer-left'>
                        <div className='footer-logo'>
                            <Link to={""}>
                                <h2>ACADEMIA</h2>
                                <span>Online Education & Learning
                                </span>
                            </Link>

                        </div>
                        <p>A small river named Duden flows by their place and supplies it with the necessary regelialia.</p>
                        <ul className='footer-social'>
                            <li>
                                <Link to={"#"}>
                                    <i className="fa-brands fa-facebook-f"></i>
                                </Link>
                            </li>
                            <li>
                                <Link to={"#"}>

                                    <i className="fa-brands fa-twitter"></i>
                                </Link>
                            </li>
                            <li>
                                <Link to={"#"}>
                                    <i className="fa-brands fa-instagram"></i>
                                </Link>
                            </li>
                        </ul>

                    </div>
                </div>
                <div className='col-4' >
                    <div className="footer-widgets__item">
                        <span className="footer-widgets__title">
                            Recent posts
                        </span>
                        <div className="footer-widgets__links">
                            <Link to={"#"} className="footer-widgets__link">
                                How to install a library in Python|Tutorial on installing Python libraries
                            </Link>
                            <Link to={"#"} className="footer-widgets__link">
                                How to install a library in Python|Tutorial on installing Python libraries
                            </Link>
                            <Link to={"#"} className="footer-widgets__link">
                                How to install a library in Python|Tutorial on installing Python libraries
                            </Link>
                            <Link to={"#"} className="footer-widgets__link">
                                How to install a library in Python|Tutorial on installing Python libraries
                            </Link>
                            <Link to={"#"} className="footer-widgets__link">
                                How to install a library in Python|Tutorial on installing Python libraries
                            </Link>
                        </div>
                    </div>
                </div>
                <div className='col-2'>
                    <div className="footer-links">
                        <h2 className="footer-links_title">Quick Links</h2>
                        <ul className="footer-link_list">
                            <li><Link to={"#"}><i className="fa-solid fa-arrow-right"></i>Contact Us</Link></li>
                            <li><Link to={"#"}><i className="fa-solid fa-arrow-right"></i>Pricing</Link></li>
                            <li><Link to={"#"}><i className="fa-solid fa-arrow-right"></i>Terms &amp; Conditions</Link></li>
                            <li><Link to={"#"}><i className="fa-solid fa-arrow-right"></i>Privacy</Link></li>
                            <li><Link to={"#"}><i className="fa-solid fa-arrow-right"></i>Feedbacks</Link></li>
                        </ul>
                    </div>

                </div>
                <div className='col-3' >
                    <div className="footer-contact">
                        <h2 className="footer-contact_title">Have a Questions?</h2>
                        <div className="footer-contact_adrress">
                            <ul>
                                <li>
                                    <i className="fa-solid fa-map"></i>
                                    <span>203 Fake St. Mountain View, San Francisco, California, USA</span>
                                </li>
                                <li><Link to={"#"}>
                                    <i className="fa-solid fa-phone"></i>
                                    <span>+2 392 3929 210</span>
                                </Link></li>
                                <li>
                                    <Link to={"#"}>
                                        <i className='fa fa-paper-plane'></i>
                                        <span>info@yourdomain.com</span>
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
