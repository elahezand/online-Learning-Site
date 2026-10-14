import Accordion from 'react-bootstrap/Accordion';
import "./AccordionItem.css"
import { Link, useParams } from 'react-router-dom';


export default function AccordionItem(props) {
    const params = useParams()
    return (
        <Accordion.Body className='session-row'>
            <div className='d-flex align-items-center gap-3 min-w-0'>
                <span className={`session-row__number ${props.free ? "is-free" : ""}`}>{props.number}</span>
                <i className={`fa-brands fa-youtube session-row__icon ${props.free ? "is-free" : ""}`}></i>
                {props.free ?
                    <Link className="session-row__title text-truncate"
                        to={`/${params.courseName}/${props._id}`}>
                        {props.title}</Link> :
                    <span className="session-row__title is-locked text-truncate">{props.title}</span>}
            </div>
            <div className='d-flex align-items-center gap-2 text-body-secondary small flex-shrink-0'>
                <span>{props.time}</span>
                {!props.free && <i className="fa fa-lock"></i>}
            </div>
        </Accordion.Body>
    )
}
