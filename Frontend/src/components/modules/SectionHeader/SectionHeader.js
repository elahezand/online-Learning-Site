import React from 'react'
import "./SectionHeader.css"
import { Link } from 'react-router-dom'

export default function SectionHeader({ title, desc, btnTitle, btnHref }) {
    return (
        <div className='section-header'>
            <div className="section-header__right">
                <span className="section-header__title title">{title}</span>
                <span className="section-header__text">{desc}</span>
            </div>
            {btnTitle && <div className="section-header__left">
                <Link to={btnHref} className="courses-header__link">
                    {btnTitle}
                </Link>
                <i className='fa fa-arrow-right'></i>
            </div>
            }
        </div>
    )
}

