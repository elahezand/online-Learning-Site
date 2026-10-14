import { useState } from 'react'
import "./Course.css"
import Spinner from 'react-bootstrap/esm/Spinner';
import { BiSolidCameraOff } from "react-icons/bi";
import { Link } from 'react-router-dom';


function CourseCover({ cover }) {
    const [isShowImage, setIsImageShow] = useState(false)
    const [isShowError, setIsShowError] = useState(false)

    return (
        <div className="course-card__cover">
            {!isShowError ?
                <img src={`http://localhost:4000/courses/covers/${cover}`} alt="" loading='lazy'
                    onLoad={() => setIsImageShow(true)}
                    onError={() => setIsShowError(true)} /> :
                <div className="img-fallback"><BiSolidCameraOff /></div>
            }
            {!isShowImage && !isShowError &&
                <div className='course-card__spinner'>
                    <Spinner animation="border" size="sm" />
                </div>}
        </div>
    )
}

function CoursePrice({ price, discount }) {
    return (
        <span className="d-inline-flex align-items-baseline gap-2 flex-wrap">
            <span className="fw-bold text-heading">
                {price === 0 ?
                    "Free" :
                    `${discount ? (price) - ((price * discount) / 100) : price} $`}
            </span>
            {discount && price > 0 ? <span className='course-card__old-price'>{price} $</span> : null}
        </span>
    )
}

export default function Course(props) {
    const hasDiscount = props.discount && props.price !== 0
    const link = `/course-info/${props.shortName}/1`

    if (props.direction === "column") {
        return (
            <article className="card course-card course-card--horizontal hover-lift h-100">
                {hasDiscount ? <span className='course-card__discount'>%{props.discount}</span> : null}
                <div className="row g-0 h-100">
                    <div className="col-sm-5 col-lg-4">
                        <CourseCover cover={props.cover} />
                    </div>
                    <div className="col-sm-7 col-lg-8 d-flex flex-column">
                        <div className="card-body d-flex flex-column gap-2">
                            <Link to={link} className="card-title h5 mb-1 course-card__title">
                                {props.name}
                            </Link>
                            <div className="d-flex align-items-center flex-wrap gap-3 small">
                                <span className="d-inline-flex align-items-center gap-2 text-body-secondary">
                                    <i className="fas fa-chalkboard-teacher text-primary-strong"></i>
                                    {props.creator}
                                </span>
                                <span className="d-inline-flex align-items-center gap-1 text-body-secondary">
                                    <i className='fa fa-star text-star'></i>
                                    {`(${props.courseAverageScore})`}
                                </span>
                                <span className="d-inline-flex align-items-center gap-2 text-body-secondary">
                                    <i className="fas fa-users text-primary-strong"></i>
                                    {props.registers}
                                </span>
                            </div>
                            <p className="text-body-secondary small mb-0 d-none d-md-block">
                                Lorem ipsum dolor sit amet consectetur adipisicing elit. Praesentium ipsam, nihil officia dolor eaque vel aliquam. Maiores saepe recusandae voluptas tempore id quia adipisci natus..
                            </p>
                            <div className="mt-auto pt-2">
                                <CoursePrice price={props.price} discount={props.discount} />
                            </div>
                        </div>
                        <Link to={link} className="course-card__footer">
                            View Information
                            <i className='fa fa-arrow-right'></i>
                        </Link>
                    </div>
                </div>
            </article>
        )
    }

    return (
        <article className="card course-card hover-lift h-100">
            {hasDiscount ? <span className='course-card__discount'>%{props.discount}</span> : null}
            <CourseCover cover={props.cover} />
            <div className="card-body d-flex flex-column gap-2">
                <h3 className="card-title h6 fw-bold mb-1 course-card__name">{props.name}</h3>
                <div className="d-flex align-items-center justify-content-between gap-2 small text-body-secondary">
                    <span className="d-inline-flex align-items-center gap-2 text-truncate">
                        <i className="fa-solid fa-chalkboard-user text-primary-strong"></i>
                        <span className="text-truncate">{props.creator}</span>
                    </span>
                    <span className="d-inline-flex align-items-center gap-1 flex-shrink-0">
                        <i className='fa fa-star text-star'></i>
                        {`(${props.courseAverageScore})`}
                    </span>
                </div>
                <div className="d-flex align-items-center justify-content-between gap-2 small mt-auto">
                    <CoursePrice price={props.price} discount={props.discount} />
                    <span className="d-inline-flex align-items-center gap-2 text-body-secondary flex-shrink-0">
                        {props.registers}
                        <i className="fa-solid fa-users text-primary-strong"></i>
                    </span>
                </div>
            </div>
            <Link to={link} className="course-card__footer">
                View Information
                <i className='fa fa-arrow-right'></i>
            </Link>
        </article>
    )
}
