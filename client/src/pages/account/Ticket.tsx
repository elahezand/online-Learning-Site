import { useEffect } from "react"
import { useParams } from "react-router-dom"
import TicketChat from "../../features/tickets/TicketChat"
import { useTicketThread } from "../../features/tickets/hooks"
import { markTicketSeen } from "../../features/tickets/ticketView"

export default function Ticket() {
    const { id = "" } = useParams()
    const { data } = useTicketThread(id)
    const ticketId = data?.ticket?._id
    const answered = data?.ticket?.answer === 1
    const updatedAt = data?.ticket?.updatedAt

    useEffect(() => {
        if (ticketId && answered) markTicketSeen({ _id: ticketId, updatedAt })
    }, [ticketId, answered, updatedAt])

    return <TicketChat ticketId={id} viewer="user" backTo="/my-account/tickets" />
}