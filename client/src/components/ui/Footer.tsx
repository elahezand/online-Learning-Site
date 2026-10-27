import { Link } from "react-router-dom"
import { FaArrowRight, FaEnvelope, FaPhone } from "react-icons/fa6"
import { useArticles } from "../../features/articles/hooks"
import { useIndexInfo } from "../../features/info/hooks"


const quickLinks = [
    { title: "Courses", to: "/courses" },
    { title: "Articles", to: "/articles" },
    { title: "Cart", to: "/cart" },
    { title: "Contact Us", to: "/contact-Us" },
]

export default function Footer() {
    const { data: info = {} } = useIndexInfo()
    const { data } = useArticles({ limit: 4 })
    const articles = data?.items ?? []


    return (
        <footer className="bg-body border-top mt-5">
            <div className="container py-5">
                <div className="row g-4 g-lg-5">
                    <div className="col-12 col-md-6 col-lg-4">
                        <Link to="/" className="d-inline-flex flex-column lh-1 mb-3">
                            <span className="fs-4 fw-bold text-primary">ACADEMIA</span>
                            <span className="small text-body-secondary mt-1">Online Education &amp; Learning</span>
                        </Link>
                        <p className="text-body-secondary mb-0">
                            Practical, project-based courses that take you from the basics to job-ready skills.
                        </p>
                    </div>

                    {articles.length > 0 &&
                        <div className="col-12 col-md-6 col-lg-3">
                            <h2 className="h6 text-uppercase fw-bold mb-3">Recent posts</h2>
                            <ul className="list-unstyled d-grid gap-2 mb-0">
                                {articles.map(post => (
                                    <li key={post._id}><Link to={`/article-info/${post.shortName}`} className="link-secondary">{post.title}</Link></li>
                                ))}
                            </ul>
                        </div>}

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

                    {(info.email || info.phone) &&
                        <div className="col-12 col-sm-6 col-lg-3">
                            <h2 className="h6 text-uppercase fw-bold mb-3">Have a question?</h2>
                            <ul className="list-unstyled d-grid gap-3 mb-0">
                                {info.phone &&
                                    <li><a href={`tel:${info.phone}`} className="link-secondary d-flex gap-2"><FaPhone className="text-primary flex-shrink-0 mt-1" />{info.phone}</a></li>}
                                {info.email &&
                                    <li><a href={`mailto:${info.email}`} className="link-secondary d-flex gap-2 text-break"><FaEnvelope className="text-primary flex-shrink-0 mt-1" />{info.email}</a></li>}
                                <li><Link to="/contact-Us" className="link-secondary d-flex gap-2"><FaArrowRight className="text-primary flex-shrink-0 mt-1" />Send us a message</Link></li>
                            </ul>
                        </div>}
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
