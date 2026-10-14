import { useEffect, useState } from 'react'
import Navbar from '../Navbar/Navbar';
import { Link } from 'react-router-dom';
import "./Landing.css"
import Button from '../Form/Button';

export default function Landing({ url }) {
    const [searchData, setSearch] = useState([])
    const [value, setValue] = useState("")
    const [info, setInfo] = useState([])


    useEffect(() => {
        fetch("http://localhost:4000/v1/infos/index")
            .then(res => res.json())
            .then(data => {
                setInfo(data)
            })
            .catch(() => setInfo([]))
    }, [])

    const searchInputHandeler = (e) => {
        if (e.target.value.trim()) {
            fetch(`http://localhost:4000/v1/search/${e.target.value}`)
                .then(res => res.json())
                .then(data => {
                    setSearch([...data.allResultArticles, ...data.allResultCourses])
                })
                .catch(() => setSearch([]))
        } else {
            setSearch([])
        }
    }

    const stats = [
        { icon: "fa-solid fa-graduation-cap", count: info.usersCount, text: "Users have registered in the ACADEMIA" },
        { icon: "fa-solid fa-book-open", count: info.coursesCount, text: "Training courses" },
        { icon: "fa-solid fa-stopwatch", count: info.totalTime, text: "Minutes of training have produced" },
    ]

    return (
        <header className='landing' style={{ backgroundImage: `url(${url})` }}>
            <Navbar phone={info.phone} email={info.email} />
            <div className="container landing__content text-center">
                <h1 className="landing__title">
                    We do not create courses at the expense of quality
                </h1>
                <p className="landing__subtitle">
                    Learn to code and advance at ACADEMIA
                </p>

                <div className="landing__search mx-auto position-relative">
                    <div className="input-group input-group-lg landing__search-group">
                        <input type="search" className="form-control" placeholder="Search courses and articles..."
                            aria-label="Search courses and articles"
                            onChange={(e) => {
                                setValue(e.target.value)
                                searchInputHandeler(e)
                            }} />
                        <Button className="btn btn-primary px-4" to={`/search/${value}`} ariaLabel="Search">
                            <i className="fas fa-search"></i>
                        </Button>
                    </div>
                    {searchData.length ?
                        <div className="list-group landing__search-results text-start">
                            {searchData.map(item => (
                                <Link key={item._id}
                                    to={item.name ? `/course-info/${item.shortName}/1` : `/article-info/${item.shortName}`}
                                    className="list-group-item list-group-item-action">
                                    <i className={`me-2 text-primary-strong ${item.name ? "fa-solid fa-graduation-cap" : "fa-regular fa-newspaper"}`}></i>
                                    {item.name ? item.name : item.title}
                                </Link>
                            ))}
                        </div> : null}
                </div>

                <div className="row row-cols-1 row-cols-sm-3 g-4 landing__stats mx-auto">
                    {stats.map((stat, index) => (
                        <div className="col" key={index}>
                            <div className="landing__stat">
                                <i className={`${stat.icon} landing__stat-icon`}></i>
                                <span className="landing__stat-count">{stat.count ?? "—"}</span>
                                <span className="landing__stat-text">{stat.text}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </header>
    )
}
