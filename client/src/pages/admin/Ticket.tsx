import { useParams } from "react-router-dom"
import TicketChat from "../../features/tickets/TicketChat"

export default function Ticket() {
    const { id = "" } = useParams()
    return <TicketChat ticketId={id} viewer="admin" backTo="/p-admin/tickets" />
}