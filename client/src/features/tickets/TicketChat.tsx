import { useEffect, useRef, useState } from "react"
import type { FormEvent, KeyboardEvent } from "react"
import { Link } from "react-router-dom"
import { FaArrowLeft, FaCheck, FaCheckDouble, FaClock, FaHeadset, FaPaperPlane, FaUser } from "react-icons/fa6"
import type { Ticket, TicketMessage } from "../../types/models"
import { useSendTicketMessage, useTicketThread } from "./hooks"
import { PRIORITY_CLASSES, PRIORITY_LABELS, departmentOf, formatDate, formatTime, isAnswered, labelOf } from "./ticketView"

type Viewer = "admin" | "user"

interface TicketChatProps {
    ticketId: string
    viewer: Viewer
    meta?: Partial<Ticket>
    backTo: string
}

const isPending = (message: TicketMessage) => message._id.startsWith("pending-")

function Bubble({ message, mine }: { message: TicketMessage; mine: boolean }) {
    const fromSupport = Number(message.isAnswer) === 1
    const author = labelOf(message.user) || (fromSupport ? "Support team" : "Student")

    return (
        <div className={`d-flex align-items-end gap-2 ${mine ? "flex-row-reverse" : ""}`}>
            <span className={`d-none d-sm-inline-flex align-items-center justify-content-center rounded-circle flex-shrink-0 p-2 lh-1 ${fromSupport ? "bg-primary-subtle text-primary-emphasis" : "bg-secondary-subtle text-secondary-emphasis"}`}
                aria-hidden="true">
                {fromSupport ? <FaHeadset /> : <FaUser />}
            </span>
            <div className={`rounded-4 px-3 py-2 shadow-sm col-10 col-md-8 col-xl-7 ${mine ? "bg-primary text-white" : "bg-body border"}`}>
                {!mine && <div className="small fw-semibold text-primary-emphasis mb-1">{author}</div>}
                <p className="mb-1 text-break" style={{ whiteSpace: "pre-wrap" }}>{message.body}</p>
                <div className={`d-flex align-items-center justify-content-end gap-1 small ${mine ? "text-white text-opacity-75" : "text-body-secondary"}`}>
                    {formatTime(message.createdAt)}
                    {mine && (isPending(message) ? <FaClock aria-label="Sending" /> : <FaCheckDouble aria-label="Sent" />)}
                </div>
            </div>
        </div>
    )
}

export default function TicketChat({ ticketId, viewer, meta, backTo }: TicketChatProps) {
    const { data, isLoading, isError } = useTicketThread(ticketId)
    const send = useSendTicketMessage(ticketId, viewer === "admin")
    const [draft, setDraft] = useState("")
    const scrollRef = useRef<HTMLDivElement>(null)

    const ticket = { ...meta, ...data?.ticket }
    const messages = data?.messages ?? []
    const answered = ticket.answer !== undefined ? isAnswered({ answer: ticket.answer }) : messages.some(m => Number(m.isAnswer) === 1)
    const isMine = (message: TicketMessage) => (viewer === "admin") === (Number(message.isAnswer) === 1)

    useEffect(() => {
        const box = scrollRef.current
        if (box) box.scrollTop = box.scrollHeight
    }, [messages.length])

    const submit = (e?: FormEvent) => {
        e?.preventDefault()
        const body = draft.trim()
        if (!body || send.isPending) return
        send.mutate(body, { onSuccess: () => setDraft("") })
    }

    const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            submit()
        }
    }

    const department = departmentOf(ticket)
    const course = labelOf(ticket.course)

    return (
        <section className="card shadow-sm overflow-hidden d-flex flex-column" style={{ height: "min(78vh, 720px)" }}>
            <header className="card-header bg-body d-flex align-items-center gap-3 py-3">
                <Link to={backTo} className="btn btn-outline-secondary p-2 lh-1" aria-label="Back to tickets"><FaArrowLeft /></Link>
                <div className="flex-grow-1 overflow-hidden">
                    <h2 className="h6 fw-bold text-body-emphasis text-truncate mb-1">{ticket.title ?? "Ticket"}</h2>
                    <div className="d-flex flex-wrap align-items-center gap-2 small text-body-secondary">
                        {department && <span>{department}</span>}
                        {course && <span>· {course}</span>}
                        {ticket.createdAt && <span>· {formatDate(ticket.createdAt)}</span>}
                    </div>
                </div>
                <div className="d-flex flex-column flex-sm-row align-items-end gap-1">
                    {ticket.priority &&
                        <span className={`badge rounded-pill ${PRIORITY_CLASSES[ticket.priority]}`}>{PRIORITY_LABELS[ticket.priority]}</span>}
                    {answered ?
                        <span className="badge rounded-pill bg-success-subtle text-success-emphasis d-inline-flex align-items-center gap-1"><FaCheck /> Answered</span> :
                        <span className="badge rounded-pill bg-warning-subtle text-warning-emphasis">Waiting for reply</span>}
                </div>
            </header>

            <div ref={scrollRef} className="flex-grow-1 overflow-auto bg-body-tertiary p-3 p-md-4 d-flex flex-column gap-3" aria-live="polite">
                {isLoading && <div className="m-auto spinner-border text-primary" role="status"><span className="visually-hidden">Loading…</span></div>}
                {isError && <div className="alert alert-danger m-auto">This conversation couldn't be loaded. Please try again.</div>}
                {!isLoading && !isError && !messages.length &&
                    <p className="m-auto text-body-secondary">No messages yet.</p>}
                {messages.map(message => <Bubble key={message._id} message={message} mine={isMine(message)} />)}
                {!isLoading && !answered && viewer === "user" && messages.length > 0 &&
                    <p className="text-center small text-body-secondary mb-0">Our team usually replies within one business day.</p>}
            </div>

            <form className="card-footer bg-body p-2 p-sm-3" onSubmit={submit}>
                {send.isError &&
                    <div className="small text-danger mb-2">
                        {send.error.response?.data?.message ?? "Your message wasn't sent. Please try again."}
                    </div>}
                <div className="d-flex align-items-end gap-2">
                    <textarea
                        className="form-control"
                        rows={Math.min(5, draft.split("\n").length)}
                        style={{ resize: "none" }}
                        placeholder={viewer === "admin" ? "Write your answer…" : "Write a message…"}
                        aria-label="Message"
                        value={draft}
                        onChange={(e) => setDraft(e.target.value)}
                        onKeyDown={onKeyDown} />
                    <button type="submit" className="btn btn-primary d-inline-flex align-items-center justify-content-center p-2 px-3"
                        disabled={!draft.trim() || send.isPending} aria-label="Send">
                        <FaPaperPlane />
                    </button>
                </div>
                <div className="d-none d-md-block small text-body-secondary mt-1">Enter to send · Shift+Enter for a new line</div>
            </form>
        </section>
    )
}
