import { useEffect, useState } from 'react'
import DataTable from "../../components/modules/p-admin/DataTable/DataTable"
import { useParams } from 'react-router-dom'
import Pageination from '../../components/modules/Pageination/Pageination'
import swal from 'sweetalert'
import getMe from '../../utils/auth'

export default function CommentsPanel() {
    const param = useParams()
    const { page } = param

    const pageSize = 10

    const [allComments, setAllComments] = useState([])
    const [currentPage, setCurrentPage] = useState(1)

    const getAllComments = async () => {
        const token = await getMe()
        if (token) {
            const res = await fetch("http://localhost:4000/v1/comments", {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                }
            })
            if (res.ok) {
                const data = await res.json()
                setAllComments(data)
            }
        }

    }

    useEffect(() => {
        getAllComments()
    }, [])

    useEffect(() => {
        setCurrentPage(page)
    }, [page, currentPage])

    const lastChild = currentPage * pageSize
    const firstChild = lastChild - pageSize

    const pageCount = Math.ceil(allComments.length / pageSize)
    const paginatedData = allComments.slice(firstChild, lastChild)


    const removeComment = async (commentId) => {
        const token = await getMe()
        if (token) {
            swal({
                title: "Are you sure to remove this comment?",
                icon: "warning",
                buttons: ["No", "yes"]
            }).then(async result => {
                if (result) {
                    const res = await fetch(`http://localhost:4000/v1/comments/${commentId}`, {
                        method: "DELETE",
                        headers: {
                            "Authorization": `Bearer ${token}`,
                        }
                    })
                    if (res.ok) {
                        swal({
                            title: "the comment was removed successfully",
                            icon: "success",
                            buttons: "ok"
                        }).then(result => {
                            if (result) {
                                getAllComments()
                            }
                        })
                    }
                }
            })
        }
    }

    const acceptComment = async (commentId) => {
        const token = await getMe()

        if (token) {
            swal({
                title: "Are you sure to accept this comment?",
                icon: "warning",
                buttons: ["No", "yes"]
            }).then(async result => {
                if (result) {
                    const res = await fetch(`http://localhost:4000/v1/comments/accept/${commentId}`, {
                        method: "PUT",
                        headers: {
                            "Authorization": `Bearer ${token}`,
                        }
                    })
                    if (res.ok) {
                        swal({
                            title: "the comment was accepted successfully",
                            icon: "success",
                            buttons: "ok"
                        }).then(result => {
                            if (result) {
                                getAllComments()
                            }
                        })
                    }
                }
            })
        }
    }

    const rejectComment = async (commentId) => {
        const token = await getMe()
        if (token) {
            swal({
                title: "Are you sure to reject this comment?",
                icon: "warning",
                buttons: ["No", "yes"]
            }).then(async result => {
                if (result) {
                    const res = await fetch(`http://localhost:4000/v1/comments/reject/${commentId}`, {
                        method: "PUT",
                        headers: {
                            "Authorization": `Bearer ${token}`,
                        }
                    })
                    if (res.ok) {
                        swal({
                            title: "the comment was rejected successfully",
                            icon: "success",
                            buttons: "ok"
                        }).then(result => {
                            if (result) {
                                getAllComments()
                            }
                        })
                    }
                }
            })
        }
    }

    const banUser = async (userId, userEmail, userPhone) => {
        const token = await getMe()
        if (token) {
            swal(
                {
                    title: "Are you sure to Ban this user?",
                    icon: "warning",
                    buttons: ["No", "yes"]
                }
            ).then(async result => {
                if (result) {
                    const res = await fetch(`http://localhost:4000/v1/users/ban/${userId}`, {
                        method: "PUT",
                        headers: {
                            "Authorization": `Bearer ${token}`,

                        },
                        body: JSON.stringify({
                            phone: userPhone,
                            email: userEmail
                        })
                    })
                    if (res.ok) {
                        swal({
                            title: "this user Banned successfully",
                            icon: "success",
                            buttons: "ok"
                        }).then(result => {
                            if (result) {
                                getAllComments()
                            }
                        })
                    }
                }
            })
        }
    }

    const readComment = (commentBody) => {
        swal({
            title: commentBody,
            buttons: "ok"
        })
    }

    const answerComment = async (commentId) => {
        const token = await getMe()
        if (token) {
            swal({
                title: "Please send your answer",
                content: "input",
                buttons: "Submit"
            }).then(async result => {
                if (result?.trim().length) {
                    const res = await fetch(`http://localhost:4000/v1/comments/answer/${commentId}`, {
                        method: "POST",
                        headers: {
                            "Authorization": `Bearer ${token}`,
                            "Content-Type": "application/json"


                        },
                        body: JSON.stringify({ body: result })

                    })
                    if (res.ok) {
                        swal({
                            title: "your answer was sended successfully",
                            icon: "success",
                            buttons: "ok"
                        }).then(result => {
                            if (result) {
                                getAllComments()
                            }
                        })
                    }
                } else {
                    swal({
                        title: "Plaese inter Your ANSWER",
                        icon: "warning",
                        buttons: "ok"
                    })
                }
            })
        }

    }

    return (
        <>
            <DataTable title="Comments">
                <table className="table table-hover align-middle mb-0">
                    <thead>
                        <tr>
                            <th className='number'>#</th>
                            <th>Creator</th>
                            <th>Course</th>
                            <th>Email</th>
                            <th>Score</th>
                            <th>Content</th>
                            <th><i className='fa fa-edit'></i></th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedData.length &&
                            paginatedData.map((comment, index) => (
                                <tr key={index}>
                                    <td
                                        className={`number ${comment.answer ?
                                            "active" : null}`}>
                                        {index + 1}</td>
                                    <td>
                                        {comment.creator.name}
                                    </td>
                                    <td>{comment.course}</td>
                                    <td>
                                        {comment.creator.email}
                                    </td>
                                    <td>
                                        <span className='d-inline-flex align-items-center gap-1'>
                                            <i className='fa fa-star text-star'></i>
                                            {comment.score}
                                        </span>
                                    </td>
                                    <td>
                                        <button
                                            onClick={(() => readComment(comment.body))}
                                            className='btn btn-sm btn-primary'>Content</button>
                                    </td>
                                    <td>
                                        <button
                                            onClick={(() => removeComment(comment._id))}
                                            className='btn btn-sm btn-danger'>Remove</button>
                                        {comment.answer ?
                                            <button
                                                onClick={(() => rejectComment(comment._id))}
                                                className='btn btn-sm btn-primary'>Reject</button>
                                            : <button
                                                onClick={(() => acceptComment(comment._id))}
                                                className='btn btn-sm btn-primary'>Accept</button>

                                        }
                                        <button
                                            onClick={(() => answerComment(comment._id))}
                                            className='btn btn-sm btn-primary'>Answer</button>
                                        <button onClick={(() =>
                                            banUser(comment.creator._id,
                                                comment.creator.email,
                                                comment.creator.phone))}
                                            className='btn btn-sm btn-danger'>Ban</button>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </DataTable>
            <Pageination
                data={paginatedData}
                pathName={`/p-admin/comments`}
                pageCount={pageCount}
                currentPage={currentPage} />
        </>

    )
}
