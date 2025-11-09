import { useState, useEffect } from 'react'
import SectionHeader from '../../modules/SectionHeader/SectionHeader'
import "./PreSaleCourses.css"
import { Swiper, SwiperSlide } from 'swiper/react';
import Course from '../../modules/Course/Course';
import { Pagination, Scrollbar, A11y, Autoplay } from 'swiper/modules';


export default function PreSaleCourses() {
    const [presellCourses, setPresellCourses] = useState([])

    const getPreSellCourses = async () => {
        const res = await fetch(`http://localhost:4000/v1/courses/presell`)
        if (res.ok) {
            const data = await res.json()
            setPresellCourses(data)
        }
    }

    useEffect(() => {
        getPreSellCourses()
    }, [])

    return (
        <div className='container' style={{ marginTop: "10rem" }}>
            <SectionHeader title="Pre-sale Courses" desc="" btnTitle="more courses" ></SectionHeader>
            <Swiper style={{ height: "400px", margin: "0 5rem" }}
                modules={[Pagination, Scrollbar, A11y, Autoplay]}
                spaceBetween={20}
                slidesPerView={3}
                autoplay
                loop={true}
                pagination={{ clickable: true }}
            >

                {presellCourses.map((course, index) => (
                    <SwiperSlide key={index}>
                        <Course {...course} />
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    )
}
