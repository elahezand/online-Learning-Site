import { useParams } from 'react-router-dom'
import PageHeader from '../../components/ui/PageHeader'
import { useSearch } from '../../features/search/hooks'
import SearchResults from '../../features/search/SearchResults'

export default function Search() {
    const { value = "" } = useParams()
    const { data, isLoading } = useSearch(value)

    return (
        <>
            <PageHeader title={`Results for “${value}”`} image="/images/blog/hero_1.jpg.webp"
                breadcrumb={[{ title: "Home", to: "/" }, { title: "Search" }]} />
            {isLoading ?
                <div className="container py-5 text-center"><div className="spinner-border text-primary" role="status" aria-label="Loading" /></div> :
                <SearchResults
                    courses={data?.allResultCourses ?? []}
                    articles={data?.allResultArticles ?? []} />}
        </>
    )
}