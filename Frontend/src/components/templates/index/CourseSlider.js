import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, A11y, Autoplay } from 'swiper/modules';
import Course from '../../modules/Course/Course';

/* Responsive course carousel shared by "popular" and "pre-sale" sections */
export default function CourseSlider({ courses }) {
    return (
        <Swiper
            modules={[Pagination, A11y, Autoplay]}
            autoplay={{ delay: 4000, disableOnInteraction: false, pauseOnMouseEnter: true }}
            spaceBetween={24}
            slidesPerView={1}
            breakpoints={{
                576: { slidesPerView: 2 },
                992: { slidesPerView: 3 },
            }}
            loop={courses.length > 3}
            pagination={{ clickable: true }}
        >
            {courses.map((course, index) => (
                <SwiperSlide key={index}>
                    <Course {...course} />
                </SwiperSlide>
            ))}
        </Swiper>
    )
}
