import React, { useEffect, useState, Suspense } from 'react'
import Topbar from '../components/modules/Topbar/Topbar'
import Footer from '../components/modules/Footer/Footer'
import { useParams } from 'react-router-dom'
import SearchMain from '../components/templates/search/SearchMain'

const Landing = React.lazy(() =>
    import('../components/modules/Landing/Landing'))

export default function Search() {
    const param = useParams()
    const [allSearchCourses, setAllSearchCourses] = useState([])
    const [allSearchArticles, setAllSearchArticles] = useState([])


    useEffect(() => {
        if (param.value) {
            fetch(`http://localhost:4000/v1/search/${param.value}`)
                .then(res => res.json())
                .then(data => {
                    setAllSearchCourses(data.allResultCourses)
                    setAllSearchArticles(data.allResultArticles)
                })
        }
    }, [param.value])

    return (
        <>
            <Topbar />
            <Suspense fallback={<span>loading....</span>}>
                <Landing url="/images/blog/hero_1.jpg.webp" />
            </Suspense>
            <SearchMain
                allSearchArticles={allSearchArticles}
                allSearchCourses={allSearchCourses} />
            <Footer />
        </>
    )
}
