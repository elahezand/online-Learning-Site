import React from 'react'
import "./CourseDetailBox.css"

export default function CourseDetailBox({ title, subtitle, icon }) {
    return (
        <>
            <div className="col-4">
                <div className="course-boxes__box">
                    <div className="course-boxes__box-right">
                        <i className={`course-boxes__box-right-icon ${icon}`}></i>
                    </div>
                    <div className="course-boxes__box-left">
                        <span className="course-boxes__box-left-title">
                           {title}
                        </span>
                        <span className="course-boxes__box-left--subtitle">
                           {subtitle}
                        </span>
                    </div>
                </div>
            </div>
        </>
    )
}
