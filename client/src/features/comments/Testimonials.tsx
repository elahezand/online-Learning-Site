import { useState } from "react"
import { Link } from "react-router-dom"
import { Swiper, SwiperSlide } from "swiper/react"
import { A11y, Autoplay } from "swiper/modules"
import type { Swiper as SwiperInstance } from "swiper"
import { FaArrowLeft, FaArrowRight, FaQuoteRight, FaStar } from "react-icons/fa6"
import type { CSSProperties } from "react"
import { useTopComments } from "./hooks"

const clamp = { display: "-webkit-box", WebkitLineClamp: 5, WebkitBoxOrient: "vertical", overflow: "hidden" } as CSSProperties

const initials = (name = "") => name.trim().split(/\s+/).slice(0, 2).map(part => part[0]?.toUpperCase()).join("")

const Stars = ({ count = 5 }: { count?: number }) => (
    <span className="d-inline-flex gap-1 text-warning" aria-label={`${count} out of 5`}>
        {Array.from({ length: count }, (_, index) => <FaStar key={index} />)}
    </span>
)

export default function Testimonials() {
    const { data: comments = [] } = useTopComments()
    const [swiper, setSwiper] = useState<SwiperInstance | null>(null)
    if (!comments.length) return null

    return (
        <section className="bg-body-tertiary py-5">
            <div className="container py-lg-5">
                <div className="row g-5 align-items-center">
                    <div className="col-12 col-lg-4">
                        <span className="badge rounded-pill bg-primary-subtle text-primary-emphasis px-3 py-2 mb-3">Testimonials</span>
                        <h2 className="display-6 fw-bold mb-3">Loved by our students</h2>
                        <p className="text-body-secondary mb-4">Real reviews from people who learned with ACADEMIA and built something real.</p>

                        <div className="d-flex align-items-center gap-3 mb-4">
                            <span className="display-5 fw-bold text-body-emphasis lh-1">5.0</span>
                            <span>
                                <span className="d-block"><Stars /></span>
                                <span className="small text-body-secondary">{comments.length} five-star reviews</span>
                            </span>
                        </div>

                        {comments.length > 1 &&
                            <div className="d-flex gap-2">
                                <button type="button" className="btn btn-outline-primary rounded-circle d-inline-flex align-items-center justify-content-center"
                                    style={{ width: 48, height: 48 }} onClick={() => swiper?.slidePrev()} aria-label="Previous review">
                                    <FaArrowLeft />
                                </button>
                                <button type="button" className="btn btn-primary rounded-circle d-inline-flex align-items-center justify-content-center"
                                    style={{ width: 48, height: 48 }} onClick={() => swiper?.slideNext()} aria-label="Next review">
                                    <FaArrowRight />
                                </button>
                            </div>}
                    </div>

                    <div className="col-12 col-lg-8">
                        <Swiper
                            modules={[A11y, Autoplay]}
                            onSwiper={setSwiper}
                            autoplay={{ delay: 5000, disableOnInteraction: false, pauseOnMouseEnter: true }}
                            spaceBetween={24}
                            slidesPerView={1}
                            breakpoints={{ 768: { slidesPerView: 2 } }}
                            loop={comments.length > 2}
                            className="py-2"
                        >
                            {comments.map(comment => (
                                <SwiperSlide key={comment._id} className="h-auto">
                                    <figure className="card border-0 shadow-sm rounded-4 h-100 mb-0 position-relative overflow-hidden">
                                        <FaQuoteRight className="position-absolute top-0 end-0 me-4 mt-4 text-primary opacity-25" style={{ fontSize: "3rem" }} aria-hidden="true" />
                                        <div className="card-body p-4 p-lg-5 d-flex flex-column gap-4">
                                            <Stars count={comment.score} />
                                            <blockquote className="mb-0 flex-grow-1">
                                                <p className="fs-5 lh-base text-body-emphasis mb-0" style={clamp}>“{comment.body}”</p>
                                            </blockquote>
                                            <figcaption className="d-flex align-items-center gap-3">
                                                <span className="d-inline-flex align-items-center justify-content-center rounded-circle bg-primary-subtle text-primary-emphasis fw-bold border border-3 border-white shadow-sm flex-shrink-0"
                                                    style={{ width: 52, height: 52 }} aria-hidden="true">
                                                    {initials(comment.creator?.name)}
                                                </span>
                                                <span className="text-truncate">
                                                    <span className="d-block fw-bold text-body-emphasis text-truncate">{comment.creator?.name ?? "Student"}</span>
                                                    {comment.course &&
                                                        <Link to={`/course-info/${comment.course.shortName}`} className="d-block small text-primary text-decoration-none text-truncate">
                                                            {comment.course.name}
                                                        </Link>}
                                                </span>
                                            </figcaption>
                                        </div>
                                    </figure>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                </div>
            </div>
        </section>
    )
}