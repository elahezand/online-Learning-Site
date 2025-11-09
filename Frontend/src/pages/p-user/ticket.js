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
        <>
            <div className="ticket">
                <div className="ticket-header">
                    <Link className="ticket-header__link" to="/my-account/add-newTicket">
                        Add New Ticket
                    </Link>
                </div>

                <div className="ticket-send">
                    <div className="ticket-send__title">
                        <span className="ticket-send__title-text">
                            <i className="ticket-send__title-icon fa fa-plus"></i>
                            Send Answer
                        </span>
                    </div>
                    <div className="ticket-send__answer">
                        <div className="ticket-send__answer-box">
                            <p className="ticket-send__answer-text">{answerTicket.ticket}</p>
                        </div>
                        <div className="ticket-send__answer-bottom">
                            <span className="ticket-send__answer-name ticket-send__answer-span">
                                Elaheh karimkhanzand
                            </span>
                            <span className="ticket-send__answer-date ticket-send__answer-span">
                                2022-11-29
                            </span>
                            <span className="ticket-send__answer-time ticket-send__answer-span">
                                14:28
                            </span>
                        </div>
                    </div>
                    <div className="ticket-send__title">
                        <span className="ticket-send__title-text">
                            <i className="ticket-send__title-icon fa fa-plus"></i>
                            Ansewr
                        </span>
                    </div>

                    {answerTicket.answer === null ? (
                        <div className="alert alert-danger">
                            there isn;t any answer
                        </div>
                    ) : (
                        <div className="ticket-send__answer-user">
                            <div className="ticket-send__answer-user-box">
                                <p className="ticket-send__answer-user-text">
                                    {answerTicket.answer}
                                </p>
                            </div>
                            <div className="ticket-send__answer-user-bottom">
                                <span className="ticket-send__answer-user-name ticket-send__answer-user-span">
                                    Elaheh karimkhanzand
                                </span>
                                <span className="ticket-send__answer-user-date ticket-send__answer-user-span">
                                    2022-11-29
                                </span>
                                <span className="ticket-send__answer-user-time ticket-send__answer-user-span">
                                    14:28
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}

