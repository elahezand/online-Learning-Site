import { FaBan, FaCheck, FaEye, FaMagnifyingGlass, FaReply, FaStar, FaTrash, FaXmark } from "react-icons/fa6"
import DataTable from "../../components/ui/DataTable"
import Pagination from "../../components/ui/Pagination"
import StatusFilter from "../../components/ui/StatusFilter"
import FilterSelect from "../../components/ui/FilterSelect"
import ActionButton, { EmptyRow, RowActions, StatusBadge } from "../../components/ui/ActionButton"
import { confirmToast, messageToast, promptToast } from "../../components/ui/toastActions"
import useListParams from "../../hooks/useListParams"
import useDebouncedValue from "../../hooks/useDebouncedValue"
import { answerSchema } from "../../validators"
import { useAcceptComment, useAnswerComment, useComments, useDeleteComment, useRejectComment } from "../../features/comments/hooks"
import type { CommentQuery } from "../../features/comments/hooks"
import { useBanUser } from "../../features/users/hooks"
import { useCourses } from "../../features/courses/hooks"
import type { Comment } from "../../types/models"

const PAGE_SIZE = 10

const STATUS_OPTIONS = [
    { value: "all", label: "All" },
    { value: "pending", label: "Waiting for review" },
    { value: "accepted", label: "Accepted" },
]

const SCORE_OPTIONS = [5, 4, 3, 2, 1].map(value => ({
    value: String(value),
    label: `${"★".repeat(value)} ${value} ${value === 1 ? "star" : "stars"}`,
}))

const isAccepted = (comment: Comment) => Number(comment.answer) === 1

export default function Comments() {
    const { page, get, update } = useListParams()
    const search = get("search")
    const course = get("course")
    const score = get("score")
    const status = get("status") || "all"
    const debouncedSearch = useDebouncedValue(search.trim())

    const { data: coursesData } = useCourses({ limit: 50, sort: "name" })
    const courses = coursesData?.items ?? []

    const { data, isLoading } = useComments({
        page,
        limit: PAGE_SIZE,
        search: debouncedSearch || undefined,
        course: course || undefined,
        score: score ? Number(score) : undefined,
        status: status === "all" ? undefined : status as CommentQuery["status"],
    })
    const comments = data?.items ?? []
    const total = data?.pagination.total ?? 0
    const start = ((data?.pagination.page ?? page) - 1) * PAGE_SIZE
    const isFiltered = Boolean(search || course || score) || status !== "all"

    const deleteComment = useDeleteComment()
    const acceptComment = useAcceptComment()
    const rejectComment = useRejectComment()
    const answerComment = useAnswerComment()
    const banUser = useBanUser()

    const remove = async (comment: Comment) => {
        const ok = await confirmToast({ title: "Remove this comment?", description: comment.body, confirmLabel: "Remove" })
        if (ok) deleteComment.mutate(comment._id)
    }

    const accept = async (comment: Comment) => {
        const ok = await confirmToast({ title: "Accept this comment?", description: "It will be shown on the course page.", confirmLabel: "Accept", variant: "success" })
        if (ok) acceptComment.mutate({ id: comment._id })
    }

    const reject = async (comment: Comment) => {
        const ok = await confirmToast({ title: "Reject this comment?", description: "It will be hidden from the course page.", confirmLabel: "Reject", variant: "warning" })
        if (ok) rejectComment.mutate({ id: comment._id })
    }

    const answer = async (comment: Comment) => {
        const body = await promptToast({ title: `Answer ${comment.creator?.name ?? "the user"}`, description: comment.body, placeholder: "Your answer", schema: answerSchema })
        if (body) answerComment.mutate({ id: comment._id, body })
    }

    const ban = async ({ creator }: Comment) => {
        if (!creator) return
        const ok = await confirmToast({ title: `Ban ${creator.name}?`, description: "They will no longer be able to log in.", confirmLabel: "Ban" })
        if (ok) banUser.mutate({ id: creator._id, phone: creator.phone, email: creator.email })
    }

    return (
        <>
            <DataTable title="Comments" actions={
                <div className="d-flex flex-wrap align-items-center gap-2">
                    <div className="input-group input-group-sm w-auto">
                        <span className="input-group-text bg-body"><FaMagnifyingGlass /></span>
                        <input type="search" className="form-control" value={search}
                            onChange={(e) => update({ search: e.target.value })}
                            placeholder="Search comments…" aria-label="Search comments" />
                    </div>
                    <FilterSelect label="Filter by course" value={course} onChange={(value) => update({ course: value })}
                        options={courses.map(item => ({ value: item._id, label: item.name }))} allLabel="All courses" />
                    <FilterSelect label="Filter by score" value={score} onChange={(value) => update({ score: value })}
                        options={SCORE_OPTIONS} allLabel="All scores" />
                    <StatusFilter options={STATUS_OPTIONS} value={status} counts={{ [status]: total }}
                        onChange={(value) => update({ status: value === "all" ? "" : value })} />
                </div>}>
                <table className="table table-hover align-middle text-nowrap mb-0">
                    <thead>
                        <tr>
                            <th className="text-body-secondary">#</th>
                            <th>Creator</th>
                            <th>Course</th>
                            <th>Score</th>
                            <th>Status</th>
                            <th className="text-end">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {comments.length ? comments.map((comment, index) => {
                            const pending = !isAccepted(comment)
                            return (
                                <tr key={comment._id} className={pending ? "fw-bold" : ""}>
                                    <td className="text-body-secondary fw-normal">{start + index + 1}</td>
                                    <td>
                                        <div className="d-flex align-items-center gap-2 text-body-emphasis">
                                            {pending && <span className="d-inline-block rounded-circle bg-primary flex-shrink-0 p-1" title="Waiting for review" aria-label="Waiting for review" />}
                                            {comment.creator?.name}
                                        </div>
                                        <div className="small text-body-secondary fw-normal text-truncate" style={{ maxWidth: "22rem" }}>{comment.body}</div>
                                    </td>
                                    <td className="fw-normal">{comment.course ?? "—"}</td>
                                    <td><span className="d-inline-flex align-items-center gap-1"><FaStar className="text-warning" />{comment.score}</span></td>
                                    <td><StatusBadge ok={comment.answer} okLabel="Accepted" pendingLabel="New" /></td>
                                    <td>
                                        <RowActions>
                                            <ActionButton variant="secondary" icon={<FaEye />} onClick={() => messageToast(comment.creator?.name ?? "Comment", comment.body)}>View</ActionButton>
                                            {comment.answer ?
                                                <ActionButton variant="warning" icon={<FaXmark />} onClick={() => reject(comment)}>Reject</ActionButton> :
                                                <ActionButton variant="success" icon={<FaCheck />} onClick={() => accept(comment)}>Accept</ActionButton>}
                                            <ActionButton icon={<FaReply />} onClick={() => answer(comment)}>Answer</ActionButton>
                                            <ActionButton variant="danger" icon={<FaTrash />} onClick={() => remove(comment)}>Remove</ActionButton>
                                            <ActionButton variant="danger" icon={<FaBan />} onClick={() => ban(comment)}>Ban</ActionButton>
                                        </RowActions>
                                    </td>
                                </tr>
                            )
                        }) : <EmptyRow colSpan={6}>{isLoading ? "Loading…" : isFiltered ? "No comments match this filter." : "No comments yet."}</EmptyRow>}
                    </tbody>
                </table>
            </DataTable>
            <Pagination pagination={data?.pagination} />
        </>
    )
}
