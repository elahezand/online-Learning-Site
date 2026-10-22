import { useState } from 'react'
import type { ChangeEvent } from 'react'
import { Link } from 'react-router-dom';
import Modal from 'react-bootstrap/Modal';
import { FaBars, FaBell, FaEarthAmericas, FaUser } from 'react-icons/fa6';
import ThemeToggle from '../ThemeToggle';
import { useAuth } from '../../../features/auth/useAuth';
import { useMarkNotificationSeen } from '../../../features/notifications/hooks'


export default function AdminTopbar({ onMenuClick }: { onMenuClick: () => void }) {

    const { userInfo: adminInfo } = useAuth()
    const notifications = adminInfo.notifications ?? []
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);

    const markSeen = useMarkNotificationSeen()

    const readMsg = (e: ChangeEvent<HTMLInputElement>, id: string) => {
        if (!e.target.checked) return
        markSeen.mutate({ id }, { onError: () => { e.target.checked = false } })
    }

    const notificationCount = notifications.length

    return (
        <header className="navbar bg-body border-bottom shadow-sm sticky-top px-3 px-lg-4">
            <div className="d-flex align-items-center gap-2">
                <button type="button" className="btn btn-outline-secondary d-lg-none p-2 lh-1"
                    onClick={onMenuClick} aria-label="Open menu">
                    <FaBars />
                </button>
                <Link to="/p-admin" className="navbar-brand fw-bold text-primary me-0">ACADEMIA</Link>
                <span className="badge bg-secondary-subtle text-secondary-emphasis d-none d-sm-inline">Admin</span>
            </div>

            <div className="d-flex align-items-center gap-2">
                <button type="button" className="btn btn-outline-secondary position-relative p-2 lh-1"
                    onClick={() => setShow(true)} aria-label={`Notifications (${notificationCount})`}>
                    <FaBell />
                    {notificationCount > 0 &&
                        <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">{notificationCount}</span>}
                </button>
                <Link to="/" className="btn btn-outline-secondary p-2 lh-1 d-none d-sm-inline-flex" aria-label="View site" title="View site">
                    <FaEarthAmericas />
                </Link>
                <ThemeToggle />

                <div className="d-flex align-items-center gap-2 ms-1">
                    {adminInfo.profile ?
                        <img src={adminInfo.profile} alt="" width="36" height="36" className="rounded-circle object-fit-cover" /> :
                        <span className="d-inline-flex align-items-center justify-content-center rounded-circle bg-primary-subtle text-primary-emphasis p-2 lh-1"><FaUser /></span>}
                    <span className="fw-medium d-none d-md-inline">{adminInfo.name}</span>
                </div>
            </div>

            <Modal show={show} onHide={handleClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title as="h5">Your messages</Modal.Title>
                </Modal.Header>
                <Modal.Body className="d-grid gap-2">
                    {notifications.length ? notifications.map(note => (
                        <div key={note._id} className="form-check form-switch">
                            <input className="form-check-input" type="checkbox" id={note._id}
                                onChange={(e) => readMsg(e, note._id)} />
                            <label className="form-check-label" htmlFor={note._id}>{note.msg}</label>
                        </div>
                    )) : <p className='text-body-secondary mb-0'>You have no new notifications.</p>}
                </Modal.Body>
            </Modal>
        </header>
    )
}
