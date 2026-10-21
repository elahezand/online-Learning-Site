import { useState } from "react"
import { Link } from "react-router-dom"
import Spinner from "react-bootstrap/Spinner"
import { BiSolidCameraOff } from "react-icons/bi"
import { FaArrowRight, FaChalkboardUser, FaStar, FaUsers } from "react-icons/fa6"
import { coverUrl } from "../../config/env"
import type { Course } from "../../types/models"

/* 16:9 cover with a spinner while loading and an icon if the image fails */
export function CourseCover({ cover, className = "" }: { cover?: string; className?: string }) {
    const [loaded, setLoaded] = useState(false)
    const [failedSrc, setFailedSrc] = useState<string | null>(null)
    const src = coverUrl(cover)
    // No cover at all, or this cover failed to load → show the placeholder
    const failed = !src || failedSrc === src

    return (
        <div className={`ratio ratio-16x9 bg-body-secondary overflow-hidden ${className}`}>
            {failed ?
                <div className="d-flex align-items-center justify-content-center fs-1 text-body-tertiary">
                    <BiSolidCameraOff />
                </div> :
                <img src={src} alt="" loading="lazy"
                    className="object-fit-cover"
                    onLoad={() => setLoaded(true)}
                    onError={() => setFailedSrc(src)} />}
            {!loaded && !failed &&
                <div className="d-flex align-items-center justify-content-center">
                    <Spinner animation="border" size="sm" className="text-primary" />
                </div>}
        </div>
    )
}

export function CoursePrice({ price, discount }: { price: number; discount?: number }) {
    if (price === 0) return <span className="fw-bold text-success">Free</span>
    const final = discount ? price - (price * discount) / 100 : price
    return (
        <span className="d-inline-flex align-items-baseline gap-2 flex-wrap">
            <span className="fw-bold text-body-emphasis">{final.toLocaleString()} $</span>
            {discount ? <del className="small text-body-secondary">{price.toLocaleString()} $</del> : null}
        </span>
    )
}

interface CourseCardProps extends Course {
    direction?: "row" | "column"
}

export default function CourseCard(props: CourseCardProps) {
    const { name, shortName, cover, creator, courseAverageScore, registers, price, discount } = props
    const link = `/course-info/${shortName}`
    const hasDiscount = Boolean(discount) && price !== 0
    const horizontal = props.direction === "column"

    return (
        <article className="card card-hover h-100 shadow-sm overflow-hidden position-relative">
            {hasDiscount &&
                <span className="badge badge-tilt text-bg-danger position-absolute top-0 start-0 m-2 z-1">-{discount}%</span>}

            <div className={horizontal ? "row g-0 h-100" : "d-flex flex-column h-100"}>
                <div className={horizontal ? "col-sm-5 col-lg-4" : ""}>
                    <CourseCover cover={cover} className={horizontal ? "h-100" : ""} />
                </div>

                <div className={`${horizontal ? "col-sm-7 col-lg-8" : ""} d-flex flex-column flex-grow-1`}>
                    <div className="card-body d-flex flex-column gap-2">
                        <h3 className="card-title h6 fw-bold mb-1">
                            <Link to={link} className="link-body-emphasis stretched-link">{name}</Link>
                        </h3>

                        <div className="d-flex align-items-center justify-content-between gap-2 small text-body-secondary">
                            <span className="d-inline-flex align-items-center gap-2 text-truncate">
                                <FaChalkboardUser className="text-primary flex-shrink-0" />
                                <span className="text-truncate">{creator}</span>
                            </span>
                            <span className="d-inline-flex align-items-center gap-1 flex-shrink-0">
                                <FaStar className="text-warning" />{courseAverageScore}
                            </span>
                        </div>

                        {horizontal &&
                            <p className="small text-body-secondary mb-0 d-none d-md-block">{props.description}</p>}

                        <div className="d-flex align-items-center justify-content-between gap-2 small mt-auto pt-2">
                            <CoursePrice price={price} discount={hasDiscount ? discount : 0} />
                            <span className="d-inline-flex align-items-center gap-1 text-body-secondary">
                                <FaUsers className="text-primary" />{registers}
                            </span>
                        </div>
                    </div>

                    <div className="card-footer bg-transparent d-flex align-items-center justify-content-between small fw-medium text-primary">
                        View course <FaArrowRight />
                    </div>
                </div>
            </div>
        </article>
    )
}