import React, { Suspense } from 'react'
import "../styles/Index.css"
import Topbar from '../components/modules/Topbar/Topbar'
import LateatCourses from "../components/templates/index/LatestCourses"
import AboutUs from '../components/templates/index/AboutUs'
import PreSaleCourses from '../components/templates/index/PreSaleCourses'
import PopularCourses from '../components/templates/index/PopularCourses'
import LatestArticle from "../components/templates/index/LatestArticle"
import NewsLetter from '../components/modules/NewsLetter/NewsLetter'
import Footer from '../components/modules/Footer/Footer'
import { Link } from 'react-router-dom'
const Landing = React.lazy(() =>
    import('../components/modules/Landing/Landing'))


export default function Index() {

    return (
        <>
            <Topbar />
            <Suspense fallback={<div className="landing-fallback">Loading…</div>}>
                <Landing url="images/blog/happy-woman-holding-laptop.jpg" />
            </Suspense>
            <LateatCourses />
            <AboutUs />
            <PopularCourses />
            <section className='enroll page-section' style={{ backgroundImage: 'url("images/blog/enroll.jpg")' }}>
                <div className="container py-5">
                    <div className="py-lg-5">
                        <h2 className="enroll__title mb-3">Education for Tomorrow's Leaders</h2>
                        <p className="enroll__text mb-4">Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts.</p>
                        <Link to={"/register"} className="btn btn-primary btn-lg px-4">Enroll NOW</Link>
                    </div>
                </div>
            </section>
            <PreSaleCourses />
            <LatestArticle />
            <NewsLetter />
            <Footer />
        </>
    )
}
