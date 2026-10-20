import { useState } from 'react'
import "./Topbar.css"
import { Link } from 'react-router-dom';
import Modal from 'react-bootstrap/Modal';
import ThemeToggle from '../../ThemeToggle/ThemeToggle';
import { useAuth } from '../../../../context/AuthContext';
import { notificationsApi } from '../../../../api';


export default function Topbar({ onMenuClick }) {
    // The admin's profile (and notifications) already live in the auth
    // context, so there is no second /auth/me request here.
    const { userInfo: adminInfo, refreshUser } = useAuth()
    const notifications = adminInfo.notifications ?? []
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);

    const readMsg = async (e, id) => {
        if (!e.target.checked) return
        try {
            await notificationsApi.markSeen(id)
            refreshUser()
        } catch {
            e.target.checked = false
        }
    }

    const notificationCount = notifications.length

    return (
        <header className='admin-topbar'>
            <div className="d-flex align-items-center gap-2">
                <button type="button" className="icon-btn icon-btn--on-primary d-lg-none"
                    onClick={onMenuClick} aria-label="Open menu">
                    <i className="fa-solid fa-bars"></i>
                </button>
                <Link to="/p-admin" className="admin-topbar__logo">ACADEMIA</Link>
            </div>

            <div className='d-flex align-items-center gap-2 gap-sm-3'>
                <button type="button" className='icon-btn icon-btn--on-primary position-relative'
                    onClick={() => setShow(true)} aria-label={`Notifications (${notificationCount})`}>
                    <i className="fa-solid fa-bell"></i>
                    <span className="admin-topbar__badge">{notificationCount}</span>
                </button>

                <button type="button" className='icon-btn icon-btn--on-primary d-none d-sm-inline-flex' aria-label="Language">
                    <i className="fa-solid fa-earth-americas"></i>
                </button>

                <button type="button" className='icon-btn icon-btn--on-primary d-none d-sm-inline-flex' aria-label="Settings">
                    <i className="fa-solid fa-gear"></i>
                </button>

                <ThemeToggle className="icon-btn--on-primary" />

                {adminInfo.profile ?
                    <img src={adminInfo.profile} alt="" className="admin-topbar__avatar" /> :
                    <span className="admin-topbar__avatar admin-topbar__avatar--empty"><i className="fa-solid fa-user"></i></span>}
                <span className='admin-topbar__name d-none d-md-inline'>{adminInfo.name}</span>
            </div>

            <Modal show={show} onHide={handleClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title as="h5">Your messages</Modal.Title>
                </Modal.Header>
                <Modal.Body className="d-flex flex-column gap-2">
                    {notifications.length ? notifications.map(note => (
                        <div key={note._id} className="form-check form-switch">
                            <input className="form-check-input" type="checkbox" id={note._id}
                                onChange={(e) => readMsg(e, note._id)} />
                            <label className="form-check-label" htmlFor={note._id}>{note.msg}</label>
                        </div>
                    )) : <div className='alert alert-warning mb-0'>There isn't any notification</div>}
                </Modal.Body>
            </Modal>
        </header>
    )
}
