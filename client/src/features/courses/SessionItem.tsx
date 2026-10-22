import { Link, useParams } from "react-router-dom"
import { FaCirclePlay, FaLock } from "react-icons/fa6"
import type { Session } from "../../types/models"

interface SessionItemProps extends Pick<Session, "_id" | "title" | "time" | "free"> {
    number: number
}

export default function SessionItem({ _id, title, time, free, number }: SessionItemProps) {
    const { courseName } = useParams()
    const content = (
        <>
            <span className="d-flex align-items-center gap-3 text-truncate">
                <span className={`badge rounded-pill ${free ? "text-bg-primary" : "text-bg-secondary"}`}>{number}</span>
                <FaCirclePlay className={`flex-shrink-0 ${free ? "text-primary" : "text-body-tertiary"}`} />
                <span className="text-truncate">{title}</span>
            </span>
            <span className="d-flex align-items-center gap-2 small text-body-secondary flex-shrink-0">
                {time}{!free && <FaLock aria-label="Locked" />}
            </span>
        </>
    )

    return free ?
        <Link to={`/${courseName}/${_id}`} className="list-group-item list-group-item-action d-flex align-items-center justify-content-between gap-3 py-3">
            {content}
        </Link> :
        <div className="list-group-item d-flex align-items-center justify-content-between gap-3 py-3 text-body-secondary">
            {content}
        </div>
}
