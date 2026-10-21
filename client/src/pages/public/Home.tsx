import Hero from '../../components/layout/Hero'
import LatestCourses from "../../features/courses/LatestCourses"
import CategoryGrid from "../../features/categories/CategoryGrid"
import AboutUs from '../../features/info/AboutUs'
import PreSaleCourses from '../../features/courses/PreSaleCourses'
import PopularCourses from '../../features/courses/PopularCourses'
import LatestArticles from "../../features/articles/LatestArticles"
import NewsLetter from '../../features/newsletter/NewsLetter'
import { Link } from 'react-router-dom'

export default function Home() {
    return (
        <>
            <Hero image="/images/blog/happy-woman-holding-laptop.jpg" />
            <CategoryGrid />
            <LatestCourses />
            <AboutUs />
            <PopularCourses />
            <section className="position-relative overflow-hidden d-flex align-items-center my-5" data-bs-theme="dark"
                style={{ background: "url(/images/blog/enroll.jpg) center 40% / cover no-repeat", minHeight: "100vh" }}>
                <div className="position-absolute top-0 start-0 w-100 h-100 bg-black banner-overlay" />
                <div className="container position-relative py-5">
                    <div className="py-lg-5 col-lg-7">
                        <h2 className="display-6 fw-bold text-white mb-3">Education for tomorrow's leaders</h2>
                        <p className="lead text-white text-opacity-75 mb-4">Join thousands of students learning with real projects and mentors who answer your questions.</p>
                        <Link to="/register" className="btn btn-primary btn-lg px-4">Enroll now</Link>
                    </div>
                </div>
            </section>
            <PreSaleCourses />
            <LatestArticles />
            <NewsLetter />
        </>
    )
}