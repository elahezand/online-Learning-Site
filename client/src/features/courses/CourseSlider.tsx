import { Swiper, SwiperSlide } from "swiper/react"
import { Pagination, A11y, Autoplay } from "swiper/modules"
import type { CSSProperties } from "react"
import CourseCard from "./CourseCard"
import type { Course } from "../../types/models"

const swiperColors = {
    "--swiper-theme-color": "var(--bs-primary)",
    "--swiper-pagination-bullet-inactive-color": "var(--bs-secondary-color)",
} as CSSProperties

export default function CourseSlider({ courses }: { courses: Course[] }) {
    return (
        <Swiper
            modules={[Pagination, A11y, Autoplay]}
            autoplay={{ delay: 4000, disableOnInteraction: false, pauseOnMouseEnter: true }}
            spaceBetween={24}
            slidesPerView={1}
            breakpoints={{ 576: { slidesPerView: 2 }, 992: { slidesPerView: 3 } }}
            loop={courses.length > 3}
            pagination={{ clickable: true }}
            className="pb-5"
            style={swiperColors}
        >
            {courses.map(course => (
                <SwiperSlide key={course._id} className="h-auto">
                    <CourseCard {...course} />
                </SwiperSlide>
            ))}
        </Swiper>
    )
}
