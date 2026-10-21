import { Link, useParams } from "react-router-dom"
import { FaPlus, FaReply } from "react-icons/fa6"
import { useTicketAnswer } from "../../features/tickets/hooks"

/* A ticket as a short conversation: the question, then the team's answer */
export default function Ticket() {
    const { id } = useParams()
    const { data: ticket = {} } = useTicketAnswer(id)

    return (
        <>
            <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-4">
                <h2 className="h4 fw-bold mb-0">Ticket</h2>
                <Link className="btn btn-primary d-inline-flex align-items-center gap-2" to="/my-account/add-newTicket">
                    <FaPlus /> New ticket
                </Link>
            </div>

            <div className="d-grid gap-4">
                <div className="d-flex flex-column align-items-start">
                    <div className="small text-body-secondary mb-1">You</div>
                    <div className="bg-body-tertiary border rounded-4 rounded-top-0 p-3 col-12 col-md-10">
                        <p className="mb-0">{ticket.ticket}</p>
                    </div>
                </div>

                <div className="d-flex flex-column align-items-end">
                    <div className="small text-body-secondary mb-1 d-inline-flex align-items-center gap-1"><FaReply /> Support team</div>
                    {ticket.answer ?
                        <div className="bg-primary-subtle text-primary-emphasis border border-primary-subtle rounded-4 rounded-top-0 p-3 col-12 col-md-10">
                            <p className="mb-0">{ticket.answer}</p>
                        </div> :
                        <div className="alert alert-primary mb-0 col-12 col-md-10">No answer yet — we'll reply as soon as possible.</div>}
                </div>
            </div>
        </>
    )
}
