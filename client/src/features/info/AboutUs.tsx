import { Link } from "react-router-dom"
import { FaArrowRight, FaChalkboardUser, FaMedal, FaTags, FaUserGraduate } from "react-icons/fa6"
import AboutUsBox from "./AboutUsBox"
import { useIndexInfo } from "./hooks"
import useInView from "../../hooks/useInView"

const FEATURES = [
    { title: "Exclusive courses", desc: "Produced in-house with dedicated support and regular updates.", icon: <FaMedal /> },
    { title: "Paid and free courses", desc: "Start for free, then go deeper with paid courses, all with full support.", icon: <FaTags /> },
    { title: "Students first", desc: "Everything is built around your goals — from the first lesson to your first job.", icon: <FaUserGraduate /> },
    { title: "Selected instructors", desc: "Only experienced, vetted instructors teach here, because quality matters.", icon: <FaChalkboardUser /> },
]

export default function AboutUs() {
    const [isVisible, ref] = useInView()
    const { data: info = {} } = useIndexInfo()

    const stats = [
        { count: info.usersCount, label: "Students" },
        { count: info.coursesCount, label: "Courses" },
    ]

    return (
        <section className="about bg-body-tertiary py-5 my-5">
            <div ref={ref} className={`container py-lg-4 fade ${isVisible ? "show" : ""}`}>
                <div className="row align-items-center gy-5 gx-lg-5">
                    <div className="col-lg-5">
                        <figure className="photo-frame bg-primary-subtle border border-primary-subtle rounded-5 p-3 mb-0 mx-auto">
                            <img src="/images/blog/about.jpg.webp" alt="A student learning on her laptop"
                                className="photo-frame__img w-100 rounded-4" loading="lazy" />
                            <figcaption className="row row-cols-2 g-0 text-center bg-body rounded-4 shadow-sm py-3 mt-3">
                                {stats.map((stat, index) => (
                                    <div key={stat.label} className={`col ${index ? "border-start" : ""}`}>
                                        <div className="fs-4 fw-bold text-body-emphasis lh-sm">{stat.count?.toLocaleString() ?? "—"}</div>
                                        <div className="small text-body-secondary">{stat.label}</div>
                                    </div>
                                ))}
                            </figcaption>
                        </figure>
                    </div>

                    <div className="col-lg-7">
                        <div className="text-center text-lg-start mb-4">
                            <span className="badge rounded-pill bg-primary-subtle text-primary-emphasis border border-primary-subtle px-3 py-2 mb-3">Why ACADEMIA</span>
                            <h2 className="display-6 fw-bold text-body-emphasis mb-2">How can we help you?</h2>
                            <p className="lead text-body-secondary mb-0">What you get when you learn with ACADEMIA</p>
                        </div>

                        <div className="row row-cols-1 row-cols-sm-2 g-3">
                            {FEATURES.map(feature => <AboutUsBox key={feature.title} {...feature} />)}
                        </div>

                        <div className="text-center text-lg-start mt-4">
                            <Link to="/courses" className="btn btn-primary btn-lg rounded-pill px-4 d-inline-flex align-items-center gap-2">
                                Browse courses <FaArrowRight />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
