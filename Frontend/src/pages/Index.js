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
            <Suspense fallback={<div style={{ height: "800px" }}>loading....</div>}>
                <Landing url="images/blog/happy-woman-holding-laptop.jpg" />
            </Suspense>
            <LateatCourses />
            <AboutUs />
            <PopularCourses />
            <div className='enroll' style={{ backgroundImage: 'url("images/blog/enroll.jpg")' }} >
                <Link to={"/register"}>Enroll NOW</Link>
                <p>Education for Tomorrow's Leaders</p>
                <p>Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts.</p>
            </div>
            <PreSaleCourses/>
            <LatestArticle />
            <NewsLetter />
            <Footer />
        </>
    )
}
