import React ,{Suspense}from 'react'
import "../styles/courseInfo.css"
import Topbar from '../components/modules/Topbar/Topbar'
import NewsLetter from '../components/modules/NewsLetter/NewsLetter'
import MainCourseInfo from "../components/templates/course-info/MainCourseInfo"
import Footer from '../components/modules/Footer/Footer'
const Landing = React.lazy(() =>
    import('../components/modules/Landing/Landing'))
export default function CourseInfo() {
  return (
    <>
      <Topbar />
      <Suspense fallback={<span>loading....</span>}>
        <Landing url="/images/blog/bg_2.jpg.webp" />
      </Suspense>
      <MainCourseInfo />
      <NewsLetter />
      <Footer />
    </>
  )
}
