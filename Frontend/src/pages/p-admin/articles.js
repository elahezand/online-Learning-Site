import { useState, useEffect } from 'react'
import DataTable from '../../components/modules/p-admin/DataTable/DataTable'
import AddNewArticle from '../../components/templates/p-admin/AddNewArticle/AddNewArticle'
import Pageination from '../../components/modules/Pageination/Pageination'
import { useParams } from 'react-router-dom'
import swal from 'sweetalert'
import { useQueryClient } from '@tanstack/react-query'
import { articlesApi, attempt, queryKeys, useArticles } from '../../api'
import { Link } from 'react-router-dom'
import { coverUrl } from '../../config/env'

export default function ArticlesPanel() {
    const param = useParams()
    const { page } = param

    const pageSize = 10

    const { data: articles = [] } = useArticles()
    const queryClient = useQueryClient()
    const getAllArticles = () => queryClient.invalidateQueries({ queryKey: queryKeys.articles })
    const [currentPage, setCurrentPage] = useState(1)



    const lastChild = currentPage * pageSize
    const firstChild = lastChild - pageSize

    const pageCount = Math.ceil(articles.length / pageSize)
    const paginatedData = articles.slice(firstChild, lastChild)

    useEffect(() => {
        setCurrentPage(page)
    }, [page, currentPage])

    const removeArticle = async (articleID) => {
        swal({
            title: "Are you sure to remove this article?",
            icon: "warning",
            buttons: ["No", "yes"]
        }).then(async result => {
            if (result) {
                const res = await attempt(articlesApi.remove(articleID))
                if (res.ok) {
                    swal({
                        title: "the Article was removed successfully",
                        icon: "success",
                        buttons: "ok"
                    }).then(result => {
                        if (result) {
                            getAllArticles()
                        }
                    })
                }
            }
        })
    
    }

    return (
        <>
            <>
                <AddNewArticle />
                <DataTable title={"Articles"}>
                    <table className="table table-hover align-middle mb-0">
                        <thead>
                            <tr>
                                <th className='number'>#</th>
                                <th>Cover</th>
                                <th>Title</th>
                                <th>Creator</th>
                                <th>Status</th>
                                <th>Link</th>
                                <th>
                                    <i className='fa fa-edit'></i>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedData.map((item, index) => (
                                <tr key={index}>
                                    <td className='number'>{index + 1}</td>
                                    <td>
                                        <img
                                            src={coverUrl(item.cover)}
                                            alt="" loading='lazy' />
                                    </td>
                                    <td className='fw-medium text-heading'>
                                        {item.title}
                                    </td>
                                    <td>{item.creator.username}</td>
                                    <td>{item.publish === 1 ? "Publish" : "Draft"}</td>
                                    <td>{item.shortName}</td>
                                    <td>
                                        <button
                                            onClick={(() => removeArticle(item._id))}
                                            className='btn btn-sm btn-danger'>Remove</button>

                                        {!item.publish ?
                                            <Link className='btn btn-sm btn-primary'
                                                to={`/p-admin/article-draft/${item.shortName}`}>Continue...</Link>
                                            : null}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </DataTable>
                <Pageination
                    data={paginatedData}
                    pathName={`/p-admin/articles`}
                    pageCount={pageCount}
                    currentPage={currentPage} />

            </>
        </>
    )
}
