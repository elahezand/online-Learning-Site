import React, { Suspense, useEffect, useState } from 'react'
import Topbar from '../components/modules/Topbar/Topbar'
import NewsLetter from '../components/modules/NewsLetter/NewsLetter'
import Footer from '../components/modules/Footer/Footer'
import { Link, useParams } from 'react-router-dom'
import "../styles/sessionInfo.css"

const Landing = React.lazy(() =>
    import('../components/modules/Landing/Landing'))

export default function SessionInfo() {
    const getFromLocalStorage = JSON.parse(localStorage.getItem("userData"))
    const params = useParams()
    const [allSessions, setAllSessions] = useState([])
    const [mainSession, setMainSession] = useState([])

    useEffect(() => {
        fetch(`http://localhost:4000/v1/courses/${params.courseName}/${params.sessionId}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${getFromLocalStorage.token}`
            }
        }).then(res => res.json())
            .then(data => {
                setAllSessions(data.sessions)
                setMainSession(data.session)

            })
    }, [params, getFromLocalStorage.token])

    return (
        <>
            <Topbar />
            <Suspense fallback={<span>loading....</span>}>
                <Landing url="/images/blog/bg_2.jpg.webp" />
            </Suspense>
            <div className='row'>
                <div className='col-3'>
                    <div className='session-wrapper'>
                        <ul className='session-wrapper_list'>
                            <h3 className='sessions-header'>Course List</h3>
                            {allSessions.map((session, index) => (
                                <div className='session-container'>
                                    <div className='session-item' >
                                        <i className="fa-brands fa-google-play"></i>
                                        <Link key={index} to={`/${params.courseName}/${session._id}`}
                                            className='session-item_link link' >
                                            {session.title}
                                        </Link>
                                    </div>
                                    <span className='session-time'>{session.time}</span>
                                </div>
                            ))}
                        </ul>
                    </div>
                </div>
                <div className='col-8'>
                    <video
                        controls
                        className='episode-content_video'
                        src={`${mainSession.video}`}>
                    </video>
                </div>

            </div>
            <NewsLetter />
            <Footer />
        </>
    )
}
