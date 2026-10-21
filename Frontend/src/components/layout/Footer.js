import { Link } from "react-router-dom"
import { FaArrowRight, FaEnvelope, FaFacebookF, FaInstagram, FaLocationDot, FaPhone, FaXTwitter } from "react-icons/fa6"

const recentPosts = Array(4).fill("How to install a library in Python")
const quickLinks = [
    { title: "Courses", to: "/courses" },
    { title: "Articles", to: "/articles" },
    { title: "Contact Us", to: "/contact-Us" },
    { title: "Terms & Conditions", to: "#" },
    { title: "Privacy", to: "#" },
]
const socials = [
    { label: "Facebook", icon: <FaFacebookF /> },
    { label: "X (Twitter)", icon: <FaXTwitter /> },
    { label: "Instagram", icon: <FaInstagram /> },
]

export default function Footer() {
    return (
        <footer className="bg-body border-top mt-5">
            <div className="container py-5">
                <div className="row g-4 g-lg-5">
                    <div className="col-12 col-md-6 col-lg-4">
                        <Link to="/" className="d-inline-flex flex-column lh-1 mb-3">
                            <span className="fs-4 fw-bold text-primary">ACADEMIA</span>
                            <span className="small text-body-secondary mt-1">Online Education &amp; Learning</span>
                        </Link>
                        <p className="text-body-secondary">
                            Practical, project-based courses that take you from the basics to job-ready skills.
                        </p>
                        <div className="d-flex gap-2">
                            {socials.map(s => (
                                <a key={s.label} href="#top" aria-label={s.label}
                                    className="btn btn-outline-secondary d-inline-flex align-items-center justify-content-center p-2 lh-1">
                                    {s.icon}
                                </a>
                            ))}
                        </div>
                    </div>

                    <div className="col-12 col-md-6 col-lg-3">
                        <h2 className="h6 text-uppercase fw-bold mb-3">Recent posts</h2>
                        <ul className="list-unstyled d-grid gap-2 mb-0">
                            {recentPosts.map((post, index) => (
                                <li key={index}><Link to="/articles" className="link-secondary">{post}</Link></li>
                            ))}
                        </ul>
                    </div>

                    <div className="col-12 col-sm-6 col-lg-2">
                        <h2 className="h6 text-uppercase fw-bold mb-3">Quick links</h2>
                        <ul className="list-unstyled d-grid gap-2 mb-0">
                            {quickLinks.map(link => (
                                <li key={link.title}>
                                    <Link to={link.to} className="link-secondary d-inline-flex align-items-center gap-2">
                                        <FaArrowRight className="text-primary small" />{link.title}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="col-12 col-sm-6 col-lg-3">
                        <h2 className="h6 text-uppercase fw-bold mb-3">Have a question?</h2>
                        <ul className="list-unstyled d-grid gap-3 mb-0 text-body-secondary">
                            <li className="d-flex gap-2"><FaLocationDot className="text-primary flex-shrink-0 mt-1" />203 Fake St. Mountain View, CA</li>
                            <li><a href="tel:+23923929210" className="link-secondary d-flex gap-2"><FaPhone className="text-primary flex-shrink-0 mt-1" />+2 392 3929 210</a></li>
                            <li><a href="mailto:info@yourdomain.com" className="link-secondary d-flex gap-2 text-break"><FaEnvelope className="text-primary flex-shrink-0 mt-1" />info@yourdomain.com</a></li>
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
