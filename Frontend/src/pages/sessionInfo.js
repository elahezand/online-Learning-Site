import React, { Suspense } from 'react'
import Topbar from '../components/modules/Topbar/Topbar'
import NewsLetter from '../components/modules/NewsLetter/NewsLetter'
import Footer from '../components/modules/Footer/Footer'
import { Link, useParams } from 'react-router-dom'
import "../styles/sessionInfo.css"
import { useSession } from '../api'

const Landing = React.lazy(() =>
    import('../components/modules/Landing/Landing'))

export default function SessionInfo() {
    const params = useParams()
    const { data } = useSession(params.courseName, params.sessionId)
    const allSessions = data?.sessions ?? []
    const mainSession = data?.session ?? {}

    return (
        <>
            <Topbar />
            <Suspense fallback={<div className="landing-fallback">Loading…</div>}>
                <Landing url="/images/blog/bg_2.jpg.webp" />
            </Suspense>
            <div className='container-fluid px-3 px-lg-4 mt-4'>
                <div className='row g-4'>
                    <div className='col-12 col-lg-8 order-1 order-lg-2'>
                        <video
                            controls
                            className='session-video'
                            src={mainSession.video || undefined}>
                        </video>
                        {mainSession.title && <h1 className="h4 mt-3">{mainSession.title}</h1>}
                    </div>
                    <div className='col-12 col-lg-4 order-2 order-lg-1'>
                        <aside className='session-list surface'>
                            <h2 className='session-list__title'>Course List</h2>
                            <div className='list-group list-group-flush'>
                                {allSessions.map((session, index) => (
                                    <Link key={index} to={`/${params.courseName}/${session._id}`}
                                        className={`list-group-item list-group-item-action d-flex align-items-center justify-content-between gap-3 ${session._id === params.sessionId ? "active" : ""}`}>
                                        <span className='d-flex align-items-center gap-2 min-w-0'>
                                            <i className="fa-brands fa-google-play session-list__icon"></i>
                                            <span className="text-truncate">{session.title}</span>
                                        </span>
                                        <span className='small flex-shrink-0'>{session.time}</span>
                                    </Link>
                                ))}
                            </div>
                        </aside>
                    </div>
                </div>
            </div>
            <NewsLetter />
            <Footer />
        </>
    )
}
