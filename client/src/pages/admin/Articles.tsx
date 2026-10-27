import { Link, useNavigate } from "react-router-dom"
import { FaPenToSquare, FaTrash } from "react-icons/fa6"
import DataTable from "../../components/ui/DataTable"
import Pagination from "../../components/ui/Pagination"
import FilterSelect from "../../components/ui/FilterSelect"
import ActionButton, { EmptyRow, RowActions, StatusBadge } from "../../components/ui/ActionButton"
import { confirmToast } from "../../components/ui/toastActions"
import { coverUrl } from "../../config/env"
import AddArticleForm from "../../features/articles/AddArticleForm"
import useListParams from "../../hooks/useListParams"
import { useArticles, useDeleteArticle } from "../../features/articles/hooks"
import type { ArticleQuery } from "../../features/articles/hooks"
import { useCategories } from "../../features/categories/hooks"
import type { Article } from "../../types/models"

const PAGE_SIZE = 12

const STATUS_OPTIONS = [
    { value: "published", label: "Published" },
    { value: "draft", label: "Drafts" },
]

export default function Articles() {
    const navigate = useNavigate()

    const { page, get, update } = useListParams()
    const category = get("category")
    const status = get("status")

    const { data: categories = [] } = useCategories()
    const { data } = useArticles({
        page,
        limit: PAGE_SIZE,
        category: category || undefined,
        status: (status || "all") as ArticleQuery["status"],
    })
    const articles = data?.items ?? []
    const start = ((data?.pagination.page ?? page) - 1) * PAGE_SIZE
    const deleteArticle = useDeleteArticle()

    const remove = async (article: Article) => {
        const ok = await confirmToast({ title: `Remove "${article.title}"?`, description: "The article will be deleted.", confirmLabel: "Remove" })
        if (ok) deleteArticle.mutate(article._id)
    }

    return (
        <>
            <AddArticleForm />
            <DataTable title="Articles" actions={
                <div className="d-flex flex-wrap align-items-center gap-2">
                    <FilterSelect label="Filter by category" value={category} onChange={(value) => update({ category: value })} allLabel="All categories"
                        options={categories.map(item => ({ value: item.name, label: item.title }))} />
                    <FilterSelect label="Filter by status" value={status} onChange={(value) => update({ status: value })} allLabel="All statuses"
                        options={STATUS_OPTIONS} />
                </div>}>
                <table className="table table-hover align-middle text-nowrap mb-0">
                    <thead>
                        <tr>
                            <th className="text-body-secondary">#</th>
                            <th>Cover</th>
                            <th>Title</th>
                            <th>Author</th>
                            <th>Status</th>
                            <th>Link</th>
                            <th className="text-end">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {articles.length ? articles.map((article, index) => (
                            <tr key={article._id}>
                                <td className="text-body-secondary">{start + index + 1}</td>
                                <td>
                                    <img src={coverUrl(article.cover)} alt="" loading="lazy" width="96" height="54"
                                        className="rounded-2 object-fit-cover bg-body-secondary" />
                                </td>
                                <td>
                                    <Link to={`/p-admin/article/${article.shortName}/edit`} className="fw-medium link-body-emphasis text-decoration-none">{article.title}</Link>
                                </td>
                                <td>{article.creator?.username ?? article.creator?.name}</td>
                                <td><StatusBadge ok={article.publish === 1} okLabel="Published" pendingLabel="Draft" /></td>
                                <td>{article.shortName}</td>
                                <td>
                                    <RowActions>
                                        <ActionButton icon={<FaPenToSquare />} onClick={() => navigate(`/p-admin/article/${article.shortName}/edit`)}>
                                            {Number(article.publish) === 1 ? "Edit" : "Continue"}
                                        </ActionButton>
                                        <ActionButton variant="danger" icon={<FaTrash />} onClick={() => remove(article)}>Remove</ActionButton>
                                    </RowActions>
                                </td>
                            </tr>
                        )) : <EmptyRow colSpan={7}>{category || status ? "No articles match this filter." : "No articles yet."}</EmptyRow>}
                    </tbody>
                </table>
            </DataTable>
            <Pagination pagination={data?.pagination} />
        </>
    )
}