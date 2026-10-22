import type { Department, Priority, Ref, Ticket } from "../../types/models"
import { ALL, type StatusOption } from "../../hooks/useStatusFilter"

const isObjectId = (value: string) => /^[a-f\d]{24}$/i.test(value)

export const labelOf = (value?: Ref<{ title?: string; name?: string }> | null) => {
    if (!value) return ""
    if (typeof value === "object") return value.title ?? value.name ?? ""
    return isObjectId(value) ? "" : value
}

export const departmentOf = (ticket: Pick<Ticket, "departmentID" | "departmentSubID">) =>
    [labelOf(ticket.departmentID as Ref<Department>), labelOf(ticket.departmentSubID as Ref<Department>)]
        .filter(Boolean)
        .join(" · ")

export const PRIORITY_LABELS: Record<Priority, string> = { 3: "High", 2: "Medium", 1: "Low" }

export const PRIORITY_CLASSES: Record<Priority, string> = {
    3: "bg-danger-subtle text-danger-emphasis",
    2: "bg-warning-subtle text-warning-emphasis",
    1: "bg-secondary-subtle text-secondary-emphasis",
}

/* Only the tickets users opened — replies are stored as tickets too */
export const isTopLevel = (ticket: Pick<Ticket, "isAnswer" | "parent">) => !ticket.isAnswer && !ticket.parent

export const isAnswered = (ticket: Pick<Ticket, "answer">) => Number(ticket.answer) === 1

export const formatDate = (iso?: string) =>
    iso ? new Date(iso).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" }) : ""

export const formatTime = (iso?: string) =>
    iso ? new Date(iso).toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" }) : ""


const SEEN_KEY = "seenTicketReplies"

const readSeen = (): Record<string, string> => {
    try {
        return JSON.parse(localStorage.getItem(SEEN_KEY) ?? "{}")
    } catch {
        return {}
    }
}

export const markTicketSeen = (ticket: Pick<Ticket, "_id" | "updatedAt">) => {
    try {
        const seen = readSeen()
        seen[ticket._id] = ticket.updatedAt ?? new Date().toISOString()
        localStorage.setItem(SEEN_KEY, JSON.stringify(seen))
    } catch {
        // storage unavailable: replies simply stay marked as new
    }
}

export const hasNewReply = (ticket: Pick<Ticket, "_id" | "answer" | "updatedAt">) => {
    if (!isAnswered(ticket)) return false
    const seenAt = readSeen()[ticket._id]
    return !seenAt || (ticket.updatedAt ? ticket.updatedAt > seenAt : false)
}

export const TICKET_FILTERS: readonly StatusOption<Pick<Ticket, "answer">>[] = [
    ALL,
    { value: "open", label: "Waiting for reply", test: ticket => !isAnswered(ticket) },
    { value: "answered", label: "Answered", test: isAnswered },
]
