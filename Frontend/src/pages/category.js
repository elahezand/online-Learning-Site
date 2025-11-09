import React, { Suspense } from 'react'
import Topbar from '../components/modules/Topbar/Topbar'
import NewsLetter from '../components/modules/NewsLetter/NewsLetter'
import Footer from '../components/modules/Footer/Footer'
import CategoryMain from "../components/templates/category/CategoryMain"
import "../styles/category.css"
const Landing = React.lazy(() =>
    import('../components/modules/Landing/Landing'))

export default function Category() {
  return (
    <>
      <Topbar />
      <Suspense fallback={<div style={{ height: "700px" }}>loading....</div>}>
        <Landing url="/images/blog/cute-freelance-girl-using-laptop-sitting-floor-smiling.jpg" />
      </Suspense>
      <CategoryMain />
      <NewsLetter />
      <Footer />
    </>
  )
}
