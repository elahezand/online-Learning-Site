import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import "../../styles/p-user/ticket.css"
import { Link } from 'react-router-dom'
import getMe from '../../utils/auth'


export default function Ticket() {
    const params = useParams()
    const [answerTicket, setAnswerTicket] = useState({})
    
    const getTicketAnswer = async () => {
        const token = await getMe()
        if (token) {
            const res = await fetch(`http://localhost:4000/v1/tickets/answer/${params.id}`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            })

            if (res.ok) {
                const data = await res.json()
                setAnswerTicket(data)
            }
        }
    }

    useEffect(() => {
        getTicketAnswer()
    }, [])

    return (
        <div className="ticket">
            <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-4">
                <h1 className="h4 mb-0">Ticket</h1>
                <Link className="btn btn-primary" to="/my-account/add-newTicket">
                    <i className="fa fa-plus me-2"></i>
                    Add New Ticket
                </Link>
            </div>

            <div className="ticket-divider"><span><i className="fa fa-paper-plane me-2"></i>Send Answer</span></div>
            <div className="ticket-message">
                <div className="ticket-bubble">
                    <p className="mb-0">{answerTicket.ticket}</p>
                </div>
                <div className="ticket-meta">
                    <span>Elaheh karimkhanzand</span>
                    <span>2022-11-29</span>
                    <span>14:28</span>
                </div>
            </div>

            <div className="ticket-divider"><span><i className="fa fa-reply me-2"></i>Answer</span></div>
            {answerTicket.answer === null ? (
                <div className="alert alert-danger">
                    there isn't any answer
                </div>
            ) : (
                <div className="ticket-message ticket-message--reply">
                    <div className="ticket-bubble">
                        <p className="mb-0">{answerTicket.answer}</p>
                    </div>
                    <div className="ticket-meta">
                        <span>Elaheh karimkhanzand</span>
                        <span>2022-11-29</span>
                        <span>14:28</span>
                    </div>
                </div>
            )}
        </div>
    )
}
