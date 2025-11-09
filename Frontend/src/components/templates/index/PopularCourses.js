import { useState, useEffect } from 'react'
import "./PopularCourses.css"
import SectionHeader from '../../modules/SectionHeader/SectionHeader';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Scrollbar, A11y, Autoplay } from 'swiper/modules';
import Course from '../../modules/Course/Course';

export default function PopularCourses() {
    const [popularCourses, setPopularCourses] = useState([])

    const getPopularCourses = async () => {
        const res = await fetch(`http://localhost:4000/v1/courses/popular`)
        if (res.status === 200) {
            const data = await res.json()
            setPopularCourses(data)
        }
    }

    useEffect(() => {
        getPopularCourses()
    }, [])


    return (
        <div className='container' style={{ marginTop: "10rem" }}>
            <SectionHeader title="Most popular courses" desc="" />
            <Swiper style={{ height: "400px", margin: "0 5rem" }}
                modules={[Pagination, Scrollbar, A11y, Autoplay]}
                autoplay
                spaceBetween={20}
                slidesPerView={3}
                loop={true}
                pagination={{ clickable: true }}
            >

                {popularCourses.map((course, index) => (
                    <SwiperSlide key={index}>
                        <Course {...course} />
                    </SwiperSlide>

                ))}
            </Swiper>
        </div>
    )
}


