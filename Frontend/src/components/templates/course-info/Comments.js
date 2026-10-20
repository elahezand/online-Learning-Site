import { useEffect, useState } from 'react'
import "./Comments.css"
import { useAuth } from '../../../context/AuthContext'
import { Link } from 'react-router-dom'
import Pageination from '../../modules/Pageination/Pageination.js'
import { useParams, useNavigate } from 'react-router-dom'
import { commentsApi } from '../../../api'
import swal from 'sweetalert'
import { notifyError } from '../../../utils/notify'


export default function Comments({ data, courseInfo }) {
    const AuthContext = useAuth()
    const params = useParams()
    const navigator = useNavigate()

    const [currentPage, setCurrentPage] = useState(1)

    const { page } = params
    const pageSize = 10

    const [comment, setComment] = useState("")
    const [score, setScore] = useState("")


    const lastChild = currentPage * pageSize
    const firstChild = lastChild - pageSize

    const pageCount = Math.ceil(data.length / pageSize)
    const paginatedData = data.slice(firstChild, lastChild)

    const sendComment = async (comment, score) => {
        if (!AuthContext.isLoggedIn) {
            const result = await swal({ title: "please logIn First!", icon: "warning", buttons: "ok" })
            if (result) navigator("/login")
            return
        }
        try {
            await commentsApi.create({ body: comment, score, courseShortName: courseInfo.shortName })
            swal({ title: "your comment was sent successfully.", icon: "success", buttons: "ok" })
        } catch (err) {
            notifyError(err, "Your comment could not be sent")
        }
    }

    useEffect(() => {
        setCurrentPage(page)
    }, [currentPage, page])

    return (
        <section className="card info-card p-3 p-sm-4 my-4">
            <h2 className="h5 fw-bold d-flex align-items-center gap-2 mb-4">
                <i className="fa fa-comment text-primary-strong"></i>
                Comments
            </h2>

            {paginatedData.length ?
                <div className="d-flex flex-column gap-3">
                    {paginatedData.map((comment, index) => (
                        <article className="comment" key={index}>
                            <div className="d-flex flex-wrap align-items-center justify-content-between gap-2">
                                {comment.creator ?
                                    <div className="d-flex flex-wrap align-items-center gap-2">
                                        <span className="fw-bold text-heading">
                                            {comment.creator.name}</span>
                                        <span className="badge rounded-pill bg-primary-subtle-token text-primary-strong">
                                            {comment.creator.role === "USER" ? "User" : "Admin"}</span>
                                        <span className="small text-body-secondary">
                                            {comment.creator.updatedAt.slice(0, 10)}</span>
                                    </div> : <span></span>
                                }
                                <button type="button" className="btn btn-sm btn-outline-primary">answer</button>
                            </div>
                            <p className="mt-2 mb-0">
                                {comment.body}</p>

                            {comment.answerContent ?
                                <div className="comment comment--answer mt-3">
                                    <div className="d-flex flex-wrap align-items-center justify-content-between gap-2">
                                        <div className="d-flex flex-wrap align-items-center gap-2">
                                            <span className="fw-bold text-heading">
                                                {comment.answerContent.creator.name}</span>
                                            <span className="badge rounded-pill text-bg-primary">
                                                {comment.answerContent.creator.role === "ADMIN" ? "Admin" : "User"}</span>
                                            <span className="small text-body-secondary">
                                                {comment.answerContent.creator.updatedAt.slice(0, 10)}</span>
                                        </div>
                                    </div>
                                    <p className="mt-2 mb-0">
                                        {comment.answerContent.body}</p>
                                </div>
                                : null}
                        </article>
                    ))}
                </div>
                :
                <div className='alert alert-warning'>
                    there isn't any comments</div>}

            {paginatedData.length ?
                <Pageination
                    data={data}
                    pathName={`/course-info/${courseInfo.shortName}`}
                    pageCount={pageCount}
                    currentPage={currentPage} />
                : null}

            {AuthContext.isLoggedIn ?
                <>
                    <div className="mt-4">
                        <h3 className="h6 fw-bold text-primary-strong mb-3"> Rules for Posting Comments </h3>
                        <ul className="list-unstyled d-flex flex-column gap-2 small text-body-secondary mb-0">
                            <li><i className="fa fa-check text-primary-strong me-2"></i>Be respectful and polite to others</li>
                            <li><i className="fa fa-check text-primary-strong me-2"></i>Avoid using offensive or inappopriate language</li>
                            <li><i className="fa fa-check text-primary-strong me-2"></i>Stay on topic and relevent to the discussion.</li>
                            <li><i className="fa fa-check text-primary-strong me-2"></i>No span, self-promotion,or advertisments</li>
                        </ul>
                    </div>

                    <div className="comment-form mt-4">
                        <label htmlFor="comment-score" className="form-label fw-medium">Your Score</label>
                        <select id="comment-score" className="form-select mb-3" onChange={(e) => setScore(e.target.value)}>
                            <option value="5">Please send your score  :)</option>
                            <option value="5">Perfect</option>
                            <option value="4"> Very good</option>
                            <option value="3">good</option>
                            <option value="2">Acceptable </option>
                            <option value="1">Not good</option>
                        </select>

                        <label htmlFor="comment-body" className="form-label fw-medium">Your Comment *</label>
                        <textarea id="comment-body" className="form-control" rows={6}
                            onChange={(e) => setComment(e.target.value)}></textarea>
                        <button type="button" className="btn btn-primary mt-3 px-4"
                            onClick={() => sendComment(comment, score)}>send</button>
                    </div>
                </> :
                <div className='alert alert-warning d-flex flex-wrap align-items-center gap-2 mt-4 mb-0'>
                    To send a comment, plaese
                    <Link to={"/login"} className="fw-bold">login <i className='fa fa-arrow-right ms-1' /></Link>
                </div>
            }
        </section>
    )
}
