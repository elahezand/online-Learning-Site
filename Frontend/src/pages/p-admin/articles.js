import { useState, useEffect } from 'react'
import DataTable from '../../components/modules/p-admin/DataTable/DataTable'
import AddNewArticle from '../../components/templates/p-admin/AddNewArticle/AddNewArticle'
import Pageination from '../../components/modules/Pageination/Pageination'
import getMe from '../../utils/auth'
import { useParams } from 'react-router-dom'
import swal from 'sweetalert'
import { Link } from 'react-router-dom'

export default function ArticlesPanel() {
    const param = useParams()
    const { page } = param

    const pageSize = 10

    const [articles, setArticles] = useState([])
    const [currentPage, setCurrentPage] = useState(1)


    const getAllArticles = async () => {
        const token = await getMe()
        if (token) {
            const res = await fetch("http://localhost:4000/v1/articles", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            if (res.ok) {
                const data = await res.json()
                setArticles(data)
            }
        }
    }
    useEffect(() => {
        getAllArticles()
        fetch("http://localhost:4000/v1/courses")
            .then(res => res.json())
            .then(data => {
                setArticles(data)
            })
    }, [])

    const lastChild = currentPage * pageSize
    const firstChild = lastChild - pageSize

    const pageCount = Math.ceil(articles.length / pageSize)
    const paginatedData = articles.slice(firstChild, lastChild)

    useEffect(() => {
        setCurrentPage(page)
    }, [page, currentPage])

    const removeArticle = async (articleID) => {
        const token = await getMe()
        if (token) {
            swal({
                title: "Are you sure to remove this article?",
                icon: "warning",
                buttons: ["No", "yes"]
            }).then(async result => {
                if (result) {
                    const res = await fetch(`http://localhost:4000/v1/articles/${articleID}`, {
                        method: "DELETE",
                        headers: {

                            "Authorization": `Bearer ${token}`
                        }
                    })
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
    }

    return (
        <>
            <>
                <AddNewArticle getAllArticles={getAllArticles} />
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
                                            src={`http://localhost:4000/courses/covers/${item.cover}`}
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
