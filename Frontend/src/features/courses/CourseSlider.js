import { Swiper, SwiperSlide } from "swiper/react"
import { Pagination, A11y, Autoplay } from "swiper/modules"
import CourseCard from "./CourseCard"

/* Responsive course carousel shared by "popular" and "pre-sale" sections.
   Swiper reads its accent color from --swiper-theme-color. */
export default function CourseSlider({ courses }) {
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
            style={{ "--swiper-theme-color": "var(--bs-primary)", "--swiper-pagination-bullet-inactive-color": "var(--bs-secondary-color)" }}
        >
            {courses.map(course => (
                <SwiperSlide key={course._id} className="h-auto">
                    <CourseCard {...course} />
                </SwiperSlide>
            ))}
        </Swiper>
    )
}
