import { useEffect, useState } from 'react'
import "./Comments.css"
import { useContext } from 'react'
import authContext from '../../../context/authContext.js.js'
import { Link } from 'react-router-dom'
import Pageination from '../../modules/Pageination/Pageination.js'
import { useParams } from 'react-router-dom'
import getMe from '../../../utils/auth.js'
import swal from 'sweetalert'


export default function Comments({ data, courseInfo }) {
    const AuthContext = useContext(authContext)
    const params = useParams()

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
        const token = await getMe()
        if (token) {
            fetch(`http://localhost:4000/v1/comments`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    body: comment,
                    score,
                    courseShortName: courseInfo.shortName
                })
            }).then(res => {
                if (res.ok) {
                    swal({
                        title: "your comment was sent successfully.",
                        icon: "success",
                        buttons: "ok"
                    })
                }
            })

        } else {
            swal({
                title: "please logIn First!",
                icon: "warning",
                buttons: "ok"
            }).then(result => {
                if (result) {
                    navigator("/login")
                }
            })
        }
    }

    useEffect(() => {
        setCurrentPage(page)
    }, [currentPage, page])

    return (
        <>
            <div className="comments">
                <div> <i className="fa fa-comment"></i>
                    <span className='comments-header'>Comments</span>
                </div>
                {paginatedData.length ?
                    paginatedData.map((comment, index) => (
                        <div className="comments-container" key={index}>
                            <div className="comment-container">
                                <div className="comments-members">
                                    <div className="comment-header">
                                        {comment.creator ?
                                            <div className="comment-title">
                                                <span className="comment-date">
                                                    {comment.creator.updatedAt.slice(0, 10)}</span>
                                                <span className="coomment-member__name">
                                                    ${comment.creator.name}</span>
                                                <span className="comment-role">
                                                    ( {comment.creator.role === "USER" ? " User " : "Admin"})</span>
                                            </div> : null
                                        }
                                        <button className="answer-button">answer</button>
                                    </div>
                                    <p className="cooments-body">
                                        {comment.body}</p>
                                </div>
                                {comment.answerContent ?
                                    <div className="comment-answer">
                                        <div className="comment-header">
                                            <div className="comment-title">
                                                <span className="coomment-member__name">
                                                    {comment.answerContent.creator.name}</span>
                                                <span className="comment-role">
                                                    ({comment.answerContent.creator.role === "ADMIN" ? "Admin" : "User"})</span>
                                                <span className="cooment-date">
                                                    {comment.answerContent.creator.updatedAt.slice(0, 10)}</span>
                                            </div>
                                            <button className="answer-button">answer</button>
                                        </div>
                                        <p className="cooments-body">
                                            {comment.answerContent.body}</p>
                                    </div>
                                    : null}
                            </div>
                        </div>
                    ))
                    :
                    <div className='alert alert-warning'>
                        there isn't any comments</div>}

                {paginatedData.length ?
                    <Pageination
                        data={data}
                        pathName={`/course-info/npm`}
                        pageCount={pageCount}
                        currentPage={currentPage} />
                    : null}

                {AuthContext.token ?
                    <>
                        <div className="rules-comment">
                            <span className="rules-comment_title"> Rules for Posting Comments </span>
                            <span className="rules-item">
                                <i className="fa fa-check"> </i>
                                Be respectful and polite to others
                            </span>
                            <span className="rules-item">
                                <i className="fa fa-check"></i>
                                Avoid using offensive or inappopriate language
                            </span>

                            <span className="rules-item">
                                <i className="fa fa-check"></i>
                                Stay on topic and relevent to the discussion.
                            </span>


                            <span className="rules-item">
                                <i className="fa fa-check"></i>
                                No span, self-promotion,or advertisments
                            </span>
                        </div>

                        <div className="creat-comment_container">
                            <div className="comments__score">
                                <span className="comments__score-title">Your Score</span>
                                <div className="col-12">
                                    <select id="comment-score" onChange={(e) => setScore(e.target.value)}>
                                        <option value="5">Please send your score  :)</option>
                                        <option value="5">Perfect</option>
                                        <option value="4"> Very good</option>
                                        <option value="3">good</option>
                                        <option value="2">Acceptable </option>
                                        <option value="1">Not good</option>
                                    </select>
                                </div>
                            </div>

                            <div className="comments__respond-content">
                                <span className="comments__respond-title"> Your Comment *</span>
                                <textarea
                                    onChange={(e) => setComment(e.target.value)} name="" id=""></textarea>
                                <button
                                    onClick={() => sendComment(comment, score)}>send</button>
                            </div>
                        </div>
                    </> :
                    <div className='alert alert-warning'>To send a comment,plaese
                        <i className='fa fa-arrow-right' />
                        <Link to={"/login"}>login :)</Link>
                    </div>
                }
            </div>

        </>
    )
}

