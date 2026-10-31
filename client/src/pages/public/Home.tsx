import Hero from '../../components/ui/Hero'
import EnrollBanner from '../../components/ui/EnrollBanner'
import LatestCourses from "../../features/courses/LatestCourses"
import CategoryGrid from "../../features/categories/CategoryGrid"
import AboutUs from '../../features/info/AboutUs'
import FreeCourses from '../../features/courses/FreeCourses'
import PreSaleCourses from '../../features/courses/PreSaleCourses'
import Testimonials from '../../features/comments/Testimonials'
import PopularCourses from '../../features/courses/PopularCourses'
import LatestArticles from "../../features/articles/LatestArticles"
import NewsLetter from '../../features/newsletter/NewsLetter'
import SiteWideBanner from '../../features/discounts/SiteWideBanner'
import Faq from '../../features/faq/Faq'
export default function Home() {
    return (
        <>
            <SiteWideBanner />
            <Hero image="/images/blog/happy-woman-holding-laptop.jpg" />
            <CategoryGrid />
            <LatestCourses />
            <PreSaleCourses />
            <FreeCourses />
            <AboutUs />
            <PopularCourses />
            <EnrollBanner />
            <Testimonials />
            <LatestArticles />
            <Faq />
            <NewsLetter />
        </>
    )
}
