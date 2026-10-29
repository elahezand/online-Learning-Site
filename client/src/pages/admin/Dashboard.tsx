import type { ReactNode } from "react"
import { Link } from "react-router-dom"
import {
    FaArrowRight, FaBagShopping, FaComments, FaEnvelope, FaGraduationCap, FaHeadset, FaStar, FaUsers,
} from "react-icons/fa6"
import DataTable from "../../components/ui/DataTable"
import { EmptyRow } from "../../components/ui/ActionButton"
import DashboardChart from "../../features/info/DashboardChart"
import { useAdminDashboard } from "../../features/info/hooks"
import { useAuth } from "../../features/auth/useAuth"
import { PRIORITY_CLASSES, PRIORITY_LABELS, formatDate } from "../../features/tickets/ticketView"

interface StatCardProps {
    label: string
    value: number
    hint: string
    icon: ReactNode
    to?: string
    highlight?: boolean
}

function StatCard({ label, value, hint, icon, to, highlight }: StatCardProps) {
    const body = (
        <div className="card-body d-flex align-items-start gap-3">
            <span className={`d-inline-flex align-items-center justify-content-center rounded-3 fs-5 p-2 lh-1 flex-shrink-0 ${highlight ? "text-bg-primary" : "bg-primary-subtle text-primary-emphasis"}`}>
                {icon}
            </span>
            <div className="overflow-hidden">
                <div className="small text-body-secondary text-truncate">{label}</div>
                <div className="fs-3 fw-bold text-body-emphasis lh-sm">{value.toLocaleString()}</div>
                <div className={`small text-truncate ${highlight ? "text-primary-emphasis fw-medium" : "text-body-secondary"}`}>{hint}</div>
            </div>
        </div>
    )
    return (
        <div className="col">
            {to ?
                <Link to={to} className="card card-hover h-100 shadow-sm text-decoration-none">{body}</Link> :
                <div className="card h-100 shadow-sm">{body}</div>}
        </div>
    )
}

function Panel({ title, to, linkLabel, children }: { title: string; to: string; linkLabel: string; children: ReactNode }) {
    return (
        <section className="card shadow-sm h-100">
            <div className="card-header d-flex align-items-center justify-content-between gap-2 py-3">
                <h2 className="h6 fw-bold mb-0">{title}</h2>
                <Link to={to} className="small fw-medium d-inline-flex align-items-center gap-1">{linkLabel} <FaArrowRight /></Link>
            </div>
            {children}
        </section>
    )
}

export default function Dashboard() {
    const { userInfo } = useAuth()
    const { data } = useAdminDashboard()
    
    const stats = data?.stats
    const count = (value?: number) => value ?? 0

    const openTickets = data?.openTickets ?? []
    const pendingComments = data?.pendingComments ?? []
    const topCourses = data?.topCourses ?? []
    const recentOrders = data?.recentOrders ?? []
    const lastUsers = data?.lastUsers ?? []

    return (
        <>
            <div className="d-flex flex-wrap align-items-end justify-content-between gap-2 mb-4">
                <div>
                    <h1 className="h4 fw-bold mb-1">Welcome back{userInfo.name ? `, ${userInfo.name}` : ""}</h1>
                    <p className="text-body-secondary mb-0">Here's what's happening on ACADEMIA today.</p>
                </div>
                <span className="small text-body-secondary">{formatDate(new Date().toISOString())}</span>
            </div>

            <div className="row row-cols-1 row-cols-sm-2 row-cols-xl-3 g-3 mb-4">
                <StatCard label="Students" value={count(stats?.students)} icon={<FaUsers />} to="/p-admin/users"
                    hint={`${count(stats?.newStudents)} joined this month`} />
                <StatCard label="Courses" value={count(stats?.courses)} icon={<FaGraduationCap />} to="/p-admin/courses"
                    hint={`${count(stats?.presell)} in pre-sale`} />
                <StatCard label="Enrollments" value={count(stats?.enrollments)} icon={<FaBagShopping />}
                    hint="Across all courses" />
                <StatCard label="Tickets waiting for reply" value={count(stats?.openTickets)} icon={<FaHeadset />} to="/p-admin/tickets?status=open"
                    hint={`${count(stats?.totalTickets)} tickets in total`} highlight={count(stats?.openTickets) > 0} />
                <StatCard label="Comments to review" value={count(stats?.pendingComments)} icon={<FaComments />} to="/p-admin/comments?status=pending"
                    hint={`${count(stats?.totalComments)} comments in total`} highlight={count(stats?.pendingComments) > 0} />
                <StatCard label="New messages" value={count(stats?.newMessages)} icon={<FaEnvelope />} to="/p-admin/contacts?status=new"
                    hint={`${count(stats?.totalMessages)} messages in total`} highlight={count(stats?.newMessages) > 0} />
            </div>

            <div className="row g-3 mb-4">
                <div className="col-12 col-xl-8">
                    <DashboardChart title="Courses by category" data={data?.coursesByCategory ?? []} valueLabel="Courses" />
                </div>
                <div className="col-12 col-xl-4">
                    <Panel title="Most popular courses" to="/p-admin/courses" linkLabel="All courses">
                        <ol className="list-group list-group-flush list-group-numbered">
                            {topCourses.length ? topCourses.map(course => (
                                <li key={course._id} className="list-group-item d-flex align-items-center gap-2">
                                    <span className="flex-grow-1 text-truncate">{course.name}</span>
                                    <span className="badge rounded-pill bg-primary-subtle text-primary-emphasis flex-shrink-0">{course.registers.toLocaleString()} students</span>
                                </li>
                            )) : <li className="list-group-item text-body-secondary">No enrollments yet.</li>}
                        </ol>
                    </Panel>
                </div>
            </div>

            <div className="row g-3 mb-4">
                <div className="col-12 col-xl-6">
                    <Panel title="Tickets waiting for reply" to="/p-admin/tickets?status=open" linkLabel="All tickets">
                        <div className="list-group list-group-flush">
                            {openTickets.length ? openTickets.map(ticket => (
                                <Link key={ticket._id} to={`/p-admin/ticket/${ticket._id}`}
                                    className="list-group-item list-group-item-action d-flex align-items-center gap-3">
                                    <span className="d-inline-block rounded-circle bg-primary flex-shrink-0 p-1" aria-hidden="true" />
                                    <div className="flex-grow-1 overflow-hidden">
                                        <div className="fw-bold text-body-emphasis text-truncate">{ticket.title}</div>
                                        <div className="small text-body-secondary text-truncate">{ticket.user?.name ?? ticket.body}</div>
                                    </div>
                                    {ticket.priority &&
                                        <span className={`badge rounded-pill flex-shrink-0 ${PRIORITY_CLASSES[ticket.priority]}`}>{PRIORITY_LABELS[ticket.priority]}</span>}
                                </Link>
                            )) : <div className="list-group-item text-body-secondary">All tickets are answered. 🎉</div>}
                        </div>
                    </Panel>
                </div>
                <div className="col-12 col-xl-6">
                    <Panel title="Comments to review" to="/p-admin/comments?status=pending" linkLabel="All comments">
                        <div className="list-group list-group-flush">
                            {pendingComments.length ? pendingComments.map(comment => (
                                <div key={comment._id} className="list-group-item d-flex align-items-center gap-3">
                                    <div className="flex-grow-1 overflow-hidden">
                                        <div className="fw-medium text-body-emphasis text-truncate">{comment.body}</div>
                                        <div className="small text-body-secondary text-truncate">{comment.creator?.name} · {comment.course?.name}</div>
                                    </div>
                                    <span className="d-inline-flex align-items-center gap-1 small flex-shrink-0"><FaStar className="text-warning" />{comment.score}</span>
                                </div>
                            )) : <div className="list-group-item text-body-secondary">No comments waiting for review.</div>}
                        </div>
                    </Panel>
                </div>
            </div>

            <div className="mb-4">
                <DataTable title="Recent orders">
                    <table className="table table-hover align-middle text-nowrap mb-0">
                        <thead>
                            <tr>
                                <th>Student</th>
                                <th>Course</th>
                                <th>Price</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentOrders.length ? recentOrders.map(order => (
                                <tr key={order._id}>
                                    <td className="fw-medium text-body-emphasis">{order.user?.name ?? "—"}</td>
                                    <td>
                                        {order.course ?
                                            <Link to={`/course-info/${order.course.shortName}`} className="link-body-emphasis text-decoration-none">{order.course.name}</Link> :
                                            "—"}
                                    </td>
                                    <td>{order.price === 0 ?
                                        <span className="badge rounded-pill bg-success-subtle text-success-emphasis">Free</span> :
                                        <span className="fw-medium">{order.price.toLocaleString()} $</span>}</td>
                                    <td className="text-body-secondary">{formatDate(order.createdAt)}</td>
                                </tr>
                            )) : <EmptyRow colSpan={4}>No orders yet.</EmptyRow>}
                        </tbody>
                    </table>
                </DataTable>
            </div>

            <DataTable title="Recent users" actions={<Link to="/p-admin/users" className="small fw-medium d-inline-flex align-items-center gap-1">All users <FaArrowRight /></Link>}>
                <table className="table table-hover align-middle text-nowrap mb-0">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Username</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Joined</th>
                        </tr>
                    </thead>
                    <tbody>
                        {lastUsers.length ? lastUsers.map(user => (
                            <tr key={user._id}>
                                <td className="fw-medium text-body-emphasis">{user.name}</td>
                                <td>{user.username}</td>
                                <td>{user.email}</td>
                                <td>{user.phone}</td>
                                <td>{formatDate(user.createdAt)}</td>
                            </tr>
                        )) : <EmptyRow colSpan={5}>No users yet.</EmptyRow>}
                    </tbody>
                </table>
            </DataTable>
        </>
    )
}