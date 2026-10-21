import { Link, useParams } from "react-router-dom"
import { FaCirclePlay, FaClock } from "react-icons/fa6"
import PageHeader from "../../components/layout/PageHeader"
import { useSession } from "../../features/courses/hooks"

export default function SessionInfo() {
    const { courseName, sessionId } = useParams()
    const { data } = useSession(courseName, sessionId)
    const sessions = data?.sessions ?? []
    const session = data?.session ?? {}

    return (
        <>
            <PageHeader
                title={session.title ?? "Session"}
                image="/images/blog/bg_2.jpg.webp"
                breadcrumb={[{ title: "Home", to: "/" }, { title: "Course", to: `/course-info/${courseName}` }, { title: session.title ?? "Session" }]} />

            <div className="container py-4 py-lg-5">
                <div className="row g-4">
                    <div className="col-12 col-lg-8">
                        <div className="ratio ratio-16x9 bg-black rounded-3 overflow-hidden shadow-sm">
                            <video controls src={session.video || undefined} />
                        </div>
                        {session.title && <h2 className="h4 fw-bold mt-3 mb-0">{session.title}</h2>}
                    </div>

                    <div className="col-12 col-lg-4">
                        <aside className="card shadow-sm">
                            <div className="card-header py-3"><h2 className="h6 fw-bold mb-0">Course sessions</h2></div>
                            <div className="list-group list-group-flush">
                                {sessions.map((item, index) => (
                                    <Link key={item._id}
                                        to={`/${courseName}/${item._id}`}
                                        aria-current={item._id === sessionId ? "true" : undefined}
                                        className={`list-group-item list-group-item-action d-flex align-items-center justify-content-between gap-3 ${item._id === sessionId ? "active" : ""}`}>
                                        <span className="d-flex align-items-center gap-2 text-truncate">
                                            <span className="small opacity-75">{index + 1}.</span>
                                            <FaCirclePlay className="flex-shrink-0" />
                                            <span className="text-truncate">{item.title}</span>
                                        </span>
                                        <span className="small d-inline-flex align-items-center gap-1 flex-shrink-0"><FaClock />{item.time}</span>
                                    </Link>
                                ))}
                            </div>
                        </aside>
                    </div>
                </div>
            </div>
        </>
    )
}
