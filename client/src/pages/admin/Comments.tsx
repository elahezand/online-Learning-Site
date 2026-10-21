import { FaBan, FaCheck, FaEye, FaReply, FaStar, FaTrash, FaXmark } from "react-icons/fa6"
import DataTable from "../../components/ui/DataTable"
import Pagination from "../../components/ui/Pagination"
import usePagination from "../../hooks/usePagination"
import ActionButton, { EmptyRow, RowActions, StatusBadge } from "../../components/ui/ActionButton"
import { confirmToast, messageToast, promptToast } from "../../components/ui/toastActions"
import { answerSchema } from "../../validators"
import { useAcceptComment, useAnswerComment, useComments, useDeleteComment, useRejectComment } from "../../features/comments/hooks"
import { useBanUser } from "../../features/users/hooks"
import type { Comment } from "../../types/models"

export default function Comments() {
        const { data: comments = [] } = useComments()
    const deleteComment = useDeleteComment()
    const acceptComment = useAcceptComment()
    const rejectComment = useRejectComment()
    const answerComment = useAnswerComment()
    const banUser = useBanUser()


    const { page, pageCount, start, pageItems: paginatedData } = usePagination(comments)

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
            <DataTable title="Comments">
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
                        {paginatedData.length ? paginatedData.map((comment, index) => (
                            <tr key={comment._id}>
                                <td className="text-body-secondary">{start + index + 1}</td>
                                <td>
                                    <div className="fw-medium text-body-emphasis">{comment.creator?.name}</div>
                                    <div className="small text-body-secondary">{comment.creator?.email}</div>
                                </td>
                                <td>{comment.course}</td>
                                <td><span className="d-inline-flex align-items-center gap-1"><FaStar className="text-warning" />{comment.score}</span></td>
                                <td><StatusBadge ok={comment.answer} okLabel="Accepted" pendingLabel="Pending" /></td>
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
                        )) : <EmptyRow colSpan={6}>No comments yet.</EmptyRow>}
                    </tbody>
                </table>
            </DataTable>
            <Pagination page={page} pageCount={pageCount} />
        </>
    )
}
