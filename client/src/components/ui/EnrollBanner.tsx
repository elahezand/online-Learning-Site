import { Link } from "react-router-dom"
import { useAuth } from "../../features/auth/useAuth"

export default function EnrollBanner() {
    const { isLoggedIn } = useAuth()

    return (
        <section className="position-relative overflow-hidden d-flex align-items-center my-5" data-bs-theme="dark"
            style={{ background: "url(/images/blog/enroll.jpg) center 40% / cover no-repeat", minHeight: "70vh" }}>
            <div className="position-absolute top-0 start-0 w-100 h-100 bg-black banner-overlay" />
            <div className="container position-relative py-5">
                <div className="py-lg-5 col-lg-7">
                    <h2 className="display-6 fw-bold text-white mb-3">Education for tomorrow's leaders</h2>
                    <p className="lead text-white text-opacity-75 mb-4">Join thousands of students learning with real projects and mentors who answer your questions.</p>
                    <Link to={isLoggedIn ? "/courses" : "/register"} className="btn btn-primary btn-lg px-4">
                        {isLoggedIn ? "Browse courses" : "Enroll now"}
                    </Link>
                </div>
            </div>
        </section>
    )
}