import { Link } from "react-router-dom"
import { FaPen, FaTrash } from "react-icons/fa6"
import DataTable from "../../components/ui/DataTable"
import Pagination from "../../components/ui/Pagination"
import usePagination from "../../hooks/usePagination"
import ActionButton, { EmptyRow, RowActions, StatusBadge } from "../../components/ui/ActionButton"
import { confirmToast } from "../../components/ui/toastActions"
import { coverUrl } from "../../config/env"
import AddArticleForm from "../../features/articles/AddArticleForm"
import { useArticles, useDeleteArticle } from "../../features/articles/hooks"

export default function Articles() {
        const { data: articles = [] } = useArticles()
    const deleteArticle = useDeleteArticle()


    const { page, pageCount, start, pageItems: paginatedData } = usePagination(articles)

    const remove = async (article) => {
        const ok = await confirmToast({ title: `Remove "${article.title}"?`, description: "The article will be deleted.", confirmLabel: "Remove" })
        if (ok) deleteArticle.mutate(article._id)
    }

    return (
        <>
            <AddArticleForm />
            <DataTable title="Articles">
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
                        {paginatedData.length ? paginatedData.map((article, index) => (
                            <tr key={article._id}>
                                <td className="text-body-secondary">{start + index + 1}</td>
                                <td>
                                    <img src={coverUrl(article.cover)} alt="" loading="lazy" width="64" height="36"
                                        className="rounded object-fit-cover bg-body-secondary" />
                                </td>
                                <td className="fw-medium text-body-emphasis">{article.title}</td>
                                <td>{article.creator?.username ?? article.creator?.name}</td>
                                <td><StatusBadge ok={article.publish === 1} okLabel="Published" pendingLabel="Draft" /></td>
                                <td>{article.shortName}</td>
                                <td>
                                    <RowActions>
                                        {article.publish !== 1 &&
                                            <Link to={`/p-admin/article-draft/${article.shortName}`}
                                                className="btn btn-sm btn-outline-primary d-inline-flex align-items-center gap-1">
                                                <FaPen /> Continue
                                            </Link>}
                                        <ActionButton variant="danger" icon={<FaTrash />} onClick={() => remove(article)}>Remove</ActionButton>
                                    </RowActions>
                                </td>
                            </tr>
                        )) : <EmptyRow colSpan={7}>No articles yet.</EmptyRow>}
                    </tbody>
                </table>
            </DataTable>
            <Pagination page={page} pageCount={pageCount} />
        </>
    )
}
