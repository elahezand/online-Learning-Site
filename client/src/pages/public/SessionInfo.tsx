import { Link, useParams } from "react-router-dom"
import { FaCirclePlay, FaClock, FaLock } from "react-icons/fa6"
import PageHeader from "../../components/ui/PageHeader"
import { mediaUrl } from "../../config/env"
import { useSession } from "../../features/courses/hooks"

export default function SessionInfo() {
    const { courseName, sessionId } = useParams()
    const { data, isLoading, isError } = useSession(courseName, sessionId)
    const sessions = data?.sessions ?? []
    const session = data?.session
    const title = session?.title ?? "Session"

    return (
        <>
            <PageHeader
                title={title}
                image="/images/blog/bg_2.jpg.webp"
                breadcrumb={[{ title: "Home", to: "/" }, { title: "Course", to: `/course-info/${courseName}` }, { title }]} />

            <div className="container py-4 py-lg-5">
                {isLoading ?
                    <div className="text-center py-5"><div className="spinner-border text-primary" role="status" aria-label="Loading" /></div> :
                    isError ?
                        <div className="alert alert-warning d-flex flex-wrap align-items-center justify-content-between gap-3 mx-auto" style={{ maxWidth: "36rem" }}>
                            <span className="d-inline-flex align-items-center gap-2"><FaLock /> You need to enroll in this course to watch this session.</span>
                            <Link to={`/course-info/${courseName}`} className="btn btn-sm btn-primary">Go to course</Link>
                        </div> :
                        <div className="row g-4">
                            <div className="col-12 col-lg-8">
                                <div className="ratio ratio-16x9 bg-black rounded-3 overflow-hidden shadow-sm">
                                    <video key={session?._id} controls src={mediaUrl(session?.videoUrl)} />
                                </div>
                                <h2 className="h4 fw-bold mt-3 mb-0">{title}</h2>
                            </div>

                            <div className="col-12 col-lg-4">
                                <aside className="card shadow-sm">
                                    <div className="card-header py-3"><h2 className="h6 fw-bold mb-0">Course sessions</h2></div>
                                    <div className="list-group list-group-flush">
                                        {sessions.map((item, index) => (
                                            <Link key={item._id}
                                                to={`/course-info/${courseName}/session/${item._id}`}
                                                aria-current={item._id === sessionId ? "true" : undefined}
                                                className={`list-group-item list-group-item-action d-flex align-items-center justify-content-between gap-3 ${item._id === sessionId ? "active" : ""}`}>
                                                <span className="d-flex align-items-center gap-2 text-truncate">
                                                    <span className="small opacity-75">{index + 1}.</span>
                                                    {item.locked ? <FaLock className="flex-shrink-0" /> : <FaCirclePlay className="flex-shrink-0" />}
                                                    <span className="text-truncate">{item.title}</span>
                                                </span>
                                                <span className="small d-inline-flex align-items-center gap-1 flex-shrink-0"><FaClock />{item.time}</span>
                                            </Link>
                                        ))}
                                    </div>
                                </aside>
                            </div>
                        </div>}
            </div>
        </>
    )
}
