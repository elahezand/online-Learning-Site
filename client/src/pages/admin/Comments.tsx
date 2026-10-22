import { useMemo } from "react"
import { FaBan, FaCheck, FaEye, FaReply, FaStar, FaTrash, FaXmark } from "react-icons/fa6"
import DataTable from "../../components/ui/DataTable"
import Pagination from "../../components/ui/Pagination"
import usePagination from "../../hooks/usePagination"
import useStatusFilter, { ALL } from "../../hooks/useStatusFilter"
import type { StatusOption } from "../../hooks/useStatusFilter"
import StatusFilter from "../../components/ui/StatusFilter"
import FilterSelect from "../../components/ui/FilterSelect"
import useQueryParam from "../../hooks/useQueryParam"
import ActionButton, { EmptyRow, RowActions, StatusBadge } from "../../components/ui/ActionButton"
import { confirmToast, messageToast, promptToast } from "../../components/ui/toastActions"
import { answerSchema } from "../../validators"
import { useAcceptComment, useAnswerComment, useComments, useDeleteComment, useRejectComment } from "../../features/comments/hooks"
import { useBanUser } from "../../features/users/hooks"
import { useCourses } from "../../features/courses/hooks"
import type { Comment, Course } from "../../types/models"

const EMPTY: Comment[] = []
const NO_COURSES: Course[] = []
const SCORES = [5, 4, 3, 2, 1]
const isObjectId = (value: string) => /^[a-f\d]{24}$/i.test(value)
const isAccepted = (comment: Comment) => Number(comment.answer) === 1

const FILTERS: readonly StatusOption<Comment>[] = [
    ALL,
    { value: "pending", label: "Waiting for review", test: comment => !isAccepted(comment) },
    { value: "accepted", label: "Accepted", test: isAccepted },
]

const byReview = (a: Comment, b: Comment) =>
    Number(isAccepted(a)) - Number(isAccepted(b)) ||
    (b.createdAt ?? "").localeCompare(a.createdAt ?? "")

export default function Comments() {
    const { data = EMPTY } = useComments()
    const { data: courses = NO_COURSES } = useCourses()
    const [course, setCourse] = useQueryParam("course")
    const [score, setScore] = useQueryParam("score")

    const comments = useMemo(() => [...data].sort(byReview), [data])

    const courseLabel = useMemo(() => {
        const names = new Map(courses.map(item => [item._id, item.name]))
        return (value = "") => names.get(value) ?? (isObjectId(value) ? "Unknown course" : value)
    }, [courses])

    const courseOptions = useMemo(() => {
        const totals = new Map<string, number>()
        comments.forEach(comment => { if (comment.course) totals.set(comment.course, (totals.get(comment.course) ?? 0) + 1) })
        return [...totals].map(([value, count]) => ({ value, count, label: courseLabel(value) }))
            .sort((a, b) => a.label.localeCompare(b.label))
    }, [comments, courseLabel])

    const scoreOptions = useMemo(() => SCORES.map(value => ({
        value: String(value),
        label: `${"★".repeat(value)} ${value} ${value === 1 ? "star" : "stars"}`,
        count: comments.filter(comment => Number(comment.score) === value).length,
    })), [comments])

    const narrowed = useMemo(() => comments.filter(comment =>
        (!course || comment.course === course) && (!score || Number(comment.score) === Number(score))),
        [comments, course, score])
    const { status, setStatus, counts, filtered } = useStatusFilter(narrowed, FILTERS)
    const deleteComment = useDeleteComment()
    const acceptComment = useAcceptComment()
    const rejectComment = useRejectComment()
    const answerComment = useAnswerComment()
    const banUser = useBanUser()


    const { page, pageCount, start, pageItems: paginatedData } = usePagination(filtered)

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
                    <FilterSelect label="Filter by course" value={course} onChange={setCourse}
                        options={courseOptions} allLabel="All courses" allCount={comments.length} />
                    <FilterSelect label="Filter by score" value={score} onChange={setScore}
                        options={scoreOptions} allLabel="All scores" />
                    <StatusFilter options={FILTERS} value={status} onChange={setStatus} counts={counts} />
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
                        {paginatedData.length ? paginatedData.map((comment, index) => {
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
                                    <td className="fw-normal">{courseLabel(comment.course)}</td>
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
                        }) : <EmptyRow colSpan={6}>{course || score || status !== "all" ? "No comments match this filter." : "No comments yet."}</EmptyRow>}
                    </tbody>
                </table>
            </DataTable>
            <Pagination page={page} pageCount={pageCount} />
        </>
    )
}
