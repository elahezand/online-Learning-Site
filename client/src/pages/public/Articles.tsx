import PageHeader from '../../components/ui/PageHeader'
import Pagination from "../../components/ui/Pagination"
import FilterSelect from '../../components/ui/FilterSelect'
import { useArticles } from '../../features/articles/hooks'
import { useCategories } from '../../features/categories/hooks'
import useListParams from '../../hooks/useListParams'
import ArticlesList from "../../features/articles/ArticlesList"

const PAGE_SIZE = 9

export default function Articles() {
    const { page, get, update } = useListParams()
    const category = get("category")

    const { data: categories = [] } = useCategories()
    const { data } = useArticles({ page, limit: PAGE_SIZE, category: category || undefined })
    const articles = data?.items ?? []

    return (
        <>
            <PageHeader title="Articles" subtitle="Tutorials, tips and news from our instructors"
                image="/images/blog/cute-freelance-girl-using-laptop-sitting-floor-smiling.jpg"
                breadcrumb={[{ title: "Home", to: "/" }, { title: "Articles" }]} />
            <div className="container pt-4 pt-lg-5 d-flex justify-content-end">
                <FilterSelect label="Filter by category" value={category} onChange={(value) => update({ category: value })} allLabel="All categories"
                    options={categories.map(item => ({ value: item.name, label: item.title }))} />
            </div>
            <ArticlesList showData={articles} />
            <Pagination pagination={data?.pagination} />
        </>
    )
}