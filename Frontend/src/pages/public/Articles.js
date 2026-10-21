import { useMemo } from 'react'
import PageHeader from '../../components/layout/PageHeader'
import Pagination from "../../components/ui/Pagination"
import usePagination from '../../hooks/usePagination'
import { useArticles } from '../../features/articles/hooks'
import ArticlesList from "../../features/articles/ArticlesList"
import NewsLetter from '../../features/newsletter/NewsLetter'

const EMPTY = []

export default function Articles() {
    const { data: allArticles = EMPTY } = useArticles()
    const articles = useMemo(() => allArticles.filter(article => article.publish === 1), [allArticles])
    const { page, pageCount, pageItems } = usePagination(articles, { limit: 9 })

    return (
        <>
            <PageHeader title="Articles" subtitle="Tutorials, tips and news from our instructors"
                image="/images/blog/cute-freelance-girl-using-laptop-sitting-floor-smiling.jpg"
                breadcrumb={[{ title: "Home", to: "/" }, { title: "Articles" }]} />
            <ArticlesList showData={pageItems} />
            <Pagination page={page} pageCount={pageCount} />
            <NewsLetter />
        </>
    )
}
