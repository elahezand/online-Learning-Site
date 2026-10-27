import { useState } from "react"
import { Link } from "react-router-dom"
import { FaArrowRight, FaCheck, FaRegComment, FaReply } from "react-icons/fa6"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useAuth } from "../auth/useAuth"
import Input from "../../components/ui/Input"
import { commentSchema } from "../../validators"
import type { CommentData } from "../../validators"
import type { Comment, CommentAnswer, CourseDetail } from "../../types/models"
import { useCreateComment } from "./hooks"

const PAGE_SIZE = 5

const RULES = [
    "Be respectful and polite to others",
    "Avoid offensive or inappropriate language",
    "Stay on topic",
    "No spam, self-promotion or advertising",
]

function CommentHeader({ creator }: { creator?: Comment["creator"] | CommentAnswer["creator"] }) {
    if (!creator) return null
    const isAdmin = creator.role === "ADMIN"
    return (
        <div className="d-flex flex-wrap align-items-center gap-2">
            <span className="fw-bold text-body-emphasis">{creator.name}</span>
            <span className={`badge rounded-pill ${isAdmin ? "text-bg-primary" : "bg-secondary-subtle text-secondary-emphasis"}`}>
                {isAdmin ? "Admin" : "Student"}
            </span>
            <span className="small text-body-secondary">{creator.updatedAt?.slice(0, 10)}</span>
        </div>
    )
}

interface CourseCommentsProps {
    data?: Comment[]
    courseInfo: Pick<CourseDetail, "shortName">
}

export default function CourseComments({ data = [], courseInfo }: CourseCommentsProps) {
    const { isLoggedIn } = useAuth()
    const [visible, setVisible] = useState(PAGE_SIZE)
    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        resolver: zodResolver(commentSchema),
        defaultValues: { body: "", score: "5" },
        mode: "onTouched",
    })
    const createComment = useCreateComment(() => reset())

    const shownComments = data.slice(0, visible)
    const remaining = data.length - visible

    const sendComment = (values: CommentData) => createComment.mutate({ ...values, courseShortName: courseInfo.shortName ?? "" })

    return (
        <section className="card shadow-sm">
            <div className="card-header d-flex align-items-center gap-2 py-3">
                <FaRegComment className="text-primary" />
                <h2 className="h5 fw-bold mb-0">Comments</h2>
                <span className="badge rounded-pill bg-secondary-subtle text-secondary-emphasis ms-auto">{data.length}</span>
            </div>

            <div className="card-body p-3 p-sm-4">
                {shownComments.length ?
                    <div className="d-grid gap-3">
                        {shownComments.map(item => (
                            <article key={item._id} className="border rounded-3 p-3 bg-body-tertiary">
                                <CommentHeader creator={item.creator} />
                                <p className="mt-2 mb-0">{item.body}</p>

                                {item.answerContent &&
                                    <div className="border-start border-3 border-primary bg-body rounded-end-3 p-3 mt-3 ms-2 ms-sm-4">
                                        <div className="d-flex align-items-center gap-2 small text-primary mb-1"><FaReply /> Answer</div>
                                        <CommentHeader creator={item.answerContent.creator} />
                                        <p className="mt-2 mb-0">{item.answerContent.body}</p>
                                    </div>}
                            </article>
                        ))}
                    </div> :
                    <p className="text-body-secondary mb-0">No comments yet — be the first to share your thoughts.</p>}

                {remaining > 0 &&
                    <button type="button" className="btn btn-outline-primary w-100 mt-3"
                        onClick={() => setVisible(count => count + PAGE_SIZE)}>
                        Show more comments ({remaining} more)
                    </button>}

                {isLoggedIn ?
                    <form className="border-top pt-4 mt-4" onSubmit={handleSubmit(sendComment)} noValidate>
                        <h3 className="h6 fw-bold mb-3">Leave a comment</h3>
                        <ul className="list-unstyled d-grid gap-1 small text-body-secondary mb-3">
                            {RULES.map(rule => <li key={rule} className="d-flex gap-2"><FaCheck className="text-primary flex-shrink-0 mt-1" />{rule}</li>)}
                        </ul>

                        <div className="row g-3">
                            <div className="col-sm-5 col-lg-4">
                                <label htmlFor="comment-score" className="form-label small fw-medium">Your rating</label>
                                <Input as="select" id="comment-score" {...register("score")} error={errors.score?.message}>
                                    <option value="5">Perfect</option>
                                    <option value="4">Very good</option>
                                    <option value="3">Good</option>
                                    <option value="2">Acceptable</option>
                                    <option value="1">Not good</option>
                                </Input>
                            </div>
                            <div className="col-12">
                                <label htmlFor="comment-body" className="form-label small fw-medium">Your comment</label>
                                <Input as="textarea" id="comment-body" rows={5} placeholder="What did you think of this course?" {...register("body")} error={errors.body?.message} />
                            </div>
                        </div>
                        <button type="submit" className="btn btn-primary mt-3 px-4" disabled={createComment.isPending}>
                            Post comment
                        </button>
                    </form> :
                    <div className="alert alert-primary d-flex flex-wrap align-items-center gap-2 mt-4 mb-0">
                        To post a comment, please
                        <Link to="/login" className="alert-link d-inline-flex align-items-center gap-1">log in <FaArrowRight /></Link>
                    </div>}
            </div>
        </section>
    )
}