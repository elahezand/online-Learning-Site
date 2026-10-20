import React, { useEffect, useState, Suspense } from 'react'
import { useParams } from 'react-router-dom'
import { useArticles } from '../api'
import Topbar from "../components/modules/Topbar/Topbar"
import ArticlesMain from "../components/templates/articles/ArticlesMain"
import NewsLetter from '../components/modules/NewsLetter/NewsLetter'
import Footer from '../components/modules/Footer/Footer'
import Pageination from "../components/modules/Pageination/Pageination"
const Landing = React.lazy(() =>
    import('../components/modules/Landing/Landing'))
export default function Articles() {
    const param = useParams()
    const { page } = param

    const pageSize = 3
    const { data: allArticles = [] } = useArticles()
    const articles = allArticles.filter(article => article.publish === 1)
    const [currentPage, setCurrentPage] = useState(1)



    useEffect(() => {
        setCurrentPage(page)
    }, [page, currentPage])

    const lastChild = currentPage * pageSize
    const firstChild = lastChild - pageSize

    const pageCount = Math.ceil(articles.length / pageSize)
    const paginatedData = articles.slice(firstChild, lastChild)    

    return (
        <>
            <Topbar />
            <Suspense fallback={<div className="landing-fallback">Loading…</div>}>
                <Landing url="/images/blog/cute-freelance-girl-using-laptop-sitting-floor-smiling.jpg" />
            </Suspense>
            <ArticlesMain
                showData={paginatedData} />
            <Pageination
                data={paginatedData}
                pathName={`/articles`}
                pageCount={pageCount}
                currentPage={currentPage} />
            <NewsLetter />
            <Footer />
        </>
    )
}
