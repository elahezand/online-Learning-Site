import React, { Suspense } from 'react'
import Topbar from "../components/modules/Topbar/Topbar"
import BreadCrumb from "../components/modules/BreadCrumb/BreadCrumb"
import ArticleInfoMain from "../components/templates/article-info/ArticleInfoMain"
import NewsLetter from "../components/modules/NewsLetter/NewsLetter"
import Footer from "../components/modules/Footer/Footer"
const Landing = React.lazy(() =>
    import('../components/modules/Landing/Landing'))
export default function ArticleInfo() {

  return (
    <>
      <Topbar />
      <Suspense fallback={<div className="landing-fallback">Loading…</div>}>
        <Landing url="/images/blog/bg_2.jpg.webp" />
      </Suspense>
      <div className="container mt-4">
        <BreadCrumb links={[
          { id: 1, title: "Home", to: "/" },
          { id: 2, title: "Articles", to: "/articles/1" },
          { id: 3, title: "Html", to: "/article-info/Html" },
        ]} />
      </div>
      <ArticleInfoMain />
      <NewsLetter />
      <Footer />
    </>
  )
}
