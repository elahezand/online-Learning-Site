import { useEffect } from "react"
import { useParams } from "react-router-dom"
import TicketChat from "../../features/tickets/TicketChat"
import { useMyTickets } from "../../features/tickets/hooks"
import { isAnswered, markTicketSeen } from "../../features/tickets/ticketView"

export default function Ticket() {
    const { id = "" } = useParams()
    const { data: tickets = [] } = useMyTickets()
    const meta = tickets.find(ticket => ticket._id === id)

    useEffect(() => {
        if (meta && isAnswered(meta)) markTicketSeen(meta)
    }, [meta])

    return <TicketChat ticketId={id} viewer="user" meta={meta} backTo="/my-account/tickets" />
}
