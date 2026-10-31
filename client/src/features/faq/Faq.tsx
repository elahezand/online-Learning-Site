import { Link } from "react-router-dom"
import Accordion from "react-bootstrap/Accordion"
import { FaHeadset } from "react-icons/fa6"

const QUESTIONS = [
    {
        question: "How long can I access a course?",
        answer: "Forever. Once you buy a course, every session stays in My courses, including new sessions added later.",
    },
    {
        question: "Can I watch a course before I buy it?",
        answer: "Yes. The first session of every course is free to watch, and some courses are completely free.",
    },
    {
        question: "Is the payment safe?",
        answer: "Payments go through Zarinpal, a trusted Iranian payment gateway. We never see or store your card details.",
    },
    {
        question: "What is the wallet?",
        answer: "Your wallet holds credit on your account, for example a refund. At checkout you can pay with the wallet, online, or both.",
    },
    {
        question: "What happens if my payment fails?",
        answer: "Nothing is charged and your cart stays as it was. If money was taken from your card, it is confirmed or returned automatically.",
    },
    {
        question: "What are pre-sale courses?",
        answer: "Courses that are still being recorded. You buy them early at a lower price and get every new session as soon as it is released.",
    },
    {
        question: "How do I get help?",
        answer: "Open a ticket from your account. Our team answers questions about courses, payments and technical problems.",
    },
]

export default function Faq() {
    return (
        <section className="container py-5">
            <div className="row g-4 g-lg-5">
                <div className="col-12 col-lg-4">
                    <h2 className="h3 fw-bold mb-2">Frequently asked questions</h2>
                    <p className="text-body-secondary mb-4">Everything you need to know before you start learning.</p>
                    <div className="card border-0 bg-primary-subtle rounded-4">
                        <div className="card-body p-4 d-flex align-items-start gap-3">
                            <span className="d-inline-flex align-items-center justify-content-center rounded-circle bg-primary text-white fs-5 p-2 lh-1 flex-shrink-0">
                                <FaHeadset />
                            </span>
                            <div>
                                <div className="fw-bold text-body-emphasis">Still have a question?</div>
                                <p className="small text-body-secondary mb-2">We usually answer within a day.</p>
                                <Link to="/contact-Us" className="small fw-medium">Contact us</Link>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-12 col-lg-8">
                    <Accordion defaultActiveKey="0" className="shadow-sm rounded-4 overflow-hidden">
                        {QUESTIONS.map((item, index) => (
                            <Accordion.Item eventKey={String(index)} key={item.question}>
                                <Accordion.Header>{item.question}</Accordion.Header>
                                <Accordion.Body className="text-body-secondary">{item.answer}</Accordion.Body>
                            </Accordion.Item>
                        ))}
                    </Accordion>
                </div>
            </div>
        </section>
    )
}
