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
            <section className="position-relative overflow-hidden my-5" data-bs-theme="dark">
                <img src="/images/blog/enroll.jpg" alt="" className="position-absolute top-0 start-0 w-100 h-100 object-fit-cover" />
                <div className="position-absolute top-0 start-0 w-100 h-100 bg-black opacity-75" />
                <div className="container position-relative py-5">
                    <div className="py-lg-5 col-lg-7">
                        <h2 className="display-6 fw-bold text-white mb-3">Education for tomorrow's leaders</h2>
                        <p className="lead text-white-50 mb-4">Join thousands of students learning with real projects and mentors who answer your questions.</p>
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
