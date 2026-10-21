import PageHeader from '../../components/layout/PageHeader'
import { useParams } from 'react-router-dom'
import { useSearch } from '../../features/search/hooks'
import SearchResults from '../../features/search/SearchResults'


export default function Search() {
    const param = useParams()
    const { data } = useSearch(param.value ?? "")
    const allSearchCourses = data?.allResultCourses ?? []
    const allSearchArticles = data?.allResultArticles ?? []

    return (
        <>
            <PageHeader title={`Results for “${param.value}”`} image="/images/blog/hero_1.jpg.webp"
                breadcrumb={[{ title: "Home", to: "/" }, { title: "Search" }]} />
            <SearchResults
                allSearchArticles={allSearchArticles}
                allSearchCourses={allSearchCourses} />
        </>
    )
}
