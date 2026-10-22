import { useParams } from "react-router-dom"
import TicketChat from "../../features/tickets/TicketChat"
import { useTickets } from "../../features/tickets/hooks"

export default function Ticket() {
    const { id = "" } = useParams()
    const { data: tickets = [] } = useTickets()
    const meta = tickets.find(ticket => ticket._id === id)

    return <TicketChat ticketId={id} viewer="admin" meta={meta} backTo="/p-admin/tickets" />
}
