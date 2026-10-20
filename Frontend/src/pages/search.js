import React, { Suspense } from 'react'
import Topbar from '../components/modules/Topbar/Topbar'
import Footer from '../components/modules/Footer/Footer'
import { useParams } from 'react-router-dom'
import { useSearch } from '../api'
import SearchMain from '../components/templates/search/SearchMain'

const Landing = React.lazy(() =>
    import('../components/modules/Landing/Landing'))

export default function Search() {
    const param = useParams()
    const { data } = useSearch(param.value)
    const allSearchCourses = data?.allResultCourses ?? []
    const allSearchArticles = data?.allResultArticles ?? []

    return (
        <>
            <Topbar />
            <Suspense fallback={<div className="landing-fallback">Loading…</div>}>
                <Landing url="/images/blog/hero_1.jpg.webp" />
            </Suspense>
            <SearchMain
                allSearchArticles={allSearchArticles}
                allSearchCourses={allSearchCourses} />
            <Footer />
        </>
    )
}
