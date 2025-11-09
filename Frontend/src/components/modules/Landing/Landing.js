import React, { useEffect, useState } from 'react'
import Navbar from '../Navbar/Navbar';
import { Link } from 'react-router-dom';
import "./Landing.css"
import Button from '../Form/Button';

export default function Landing({ url }) {
    const [searchData, setSearch] = useState([])
    const [value, setValue] = useState(null)
    const [info, setInfo] = useState([])


    useEffect(() => {
        fetch("http://localhost:4000/v1/infos/index")
            .then(res => res.json())
            .then(data => {
                setInfo(data)
                
            })
    }, [])

    const searchInputHandeler = (e) => {
        if (e.target.value.trim()) {
            fetch(`http://localhost:4000/v1/search/${e.target.value}`)
                .then(res => res.json())
                .then(data => {
                    setSearch([...data.allResultArticles, ...data.allResultCourses])
                })
        } else {
            setSearch([])
        }

    }


    return (
        <div className='landing' style={{
            backgroundImage: `url(${url})`, loading: "lazy"
        }} >
            <Navbar phone={info.phone} email={info.email} />
            <div className="container-landing">
                <h1 className="landing__title">
                    We do not create courses at the expense of quality
                </h1>
                <h2 style={{ height: "50px" }} className="landing__subtitle">
                    Learn to code and advance at ACADEMIA
                </h2>
                <div className="landing__searchbar">
                    <Button id="search-btn" type="submit"
                        to={`/search/${value}`}>
                        <i className="fas fa-search landing__searchbar-input_icon"></i>
                    </Button>
                    <input type="text" className="landing__searchbar-input" placeholder="Search..."
                        onChange={(e) => {
                            setValue(e.target.value)
                            searchInputHandeler(e)
                        }} />
                    {searchData.length ?
                        <ul className="search__dropdown">
                            {searchData.map(item => (
                                <Link key={item._id}
                                    to={`/course-info/${item.shortName}/1`}
                                    className="search__dropdown-item">
                                    {item.name ? item.name : item.title}
                                </Link>
                            ))} </ul> : null}

                </div>
                <div className="landing-status">
                    <div className="landing-status__item">
                        <i className="fa-solid fa-graduation-cap landing__searchbar-icon"></i>
                        <span className="landing-status__count" id="courses-count">{info.usersCount}</span>
                        <span className="landing-status__text">Users have registered in the ACADEMIA</span>
                    </div>

                    <div className="landing-status__item">
                        <i className="fa-solid fa-book-open landing__searchbar-icon"></i>
                        <span className="landing-status__count" id="courses-count">{info.coursesCount}</span>
                        <span className="landing-status__text">Training courses</span>
                    </div>

                    <div className="landing-status__item">
                        <i className="fa-solid fa-stopwatch landing__searchbar-icon"></i>
                        <span className="landing-status__count" id="courses-count">{info.totalTime}</span>
                        <span className="landing-status__text">Minutes of training have produced</span>
                    </div>
                </div>
            </div>
        </div>
    )
}


