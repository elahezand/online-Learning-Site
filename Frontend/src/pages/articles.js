import React, { useEffect, useState, Suspense } from 'react'
import { useParams } from 'react-router-dom'
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
    const [articles, setarticles] = useState([])
    const [currentPage, setCurrentPage] = useState(1)

    const getArticles = async () => {
        const res = await fetch(`http://localhost:4000/v1/articles`)
        if (res.status === 200) {
            const data = await res.json()
            setarticles(data.filter(article => article.publish === 1))
        }
    }

    useEffect(() => {
        getArticles()
    }, [])

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
            <Suspense fallback={<span>landing...</span>}>
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
