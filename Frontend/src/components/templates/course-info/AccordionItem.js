import React from 'react'
import Accordion from 'react-bootstrap/Accordion';
import "./AccordionItem.css"
import { Link, useParams } from 'react-router-dom';


export default function AccordionItem(props) {
    const params = useParams()
    return (
        <>
            <Accordion.Body>
                {props.free ?
                    <div className='acordion-body'>
                        <div className='acordion-body_right' >
                            <i className='fa-brands fa-youtube active'></i>
                            <span className='active'>{props.number}</span>
                            <Link
                                to={`/${params.courseName}/${props._id}`}>
                                {props.title}</Link>
                        </div>
                        <div className='acordion-body_left'>
                            <span>{props.time}</span>
                        </div>
                    </div> :
                    <div className='acordion-body'>
                        <div className='acordion-body_right' >
                            <i className='fa-brands fa-youtube'></i>
                            <span>{props.number}</span>
                            <p style={{ color: "#b1adad" }}>{props.title}</p>
                        </div>
                        <div className='acordion-body_left'>
                            <span>{props.time}</span>
                            <i className="fa fa-lock"></i>
                        </div>
                    </div>
                }
            </Accordion.Body>
        </>
    )
}
