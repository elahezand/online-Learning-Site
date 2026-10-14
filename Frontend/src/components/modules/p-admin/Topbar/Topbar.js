import { useCallback, useEffect, useState } from 'react'
import "./Topbar.css"
import { Link } from 'react-router-dom';
import Modal from 'react-bootstrap/Modal';
import ThemeToggle from '../../ThemeToggle/ThemeToggle';


export default function Topbar({ onMenuClick }) {
    const [adminInfo, setAdminInfo] = useState([])
    const [notifications, setNotifications] = useState([])
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);

    const localStorageData = JSON.parse(localStorage.getItem("userData"))

    const getAdminInfo = useCallback(() => {
        fetch(`http://localhost:4000/v1/auth/me`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${localStorageData.token}`
            }
        }).then(res => res.json())
            .then(data => {
                setAdminInfo(data)
                setNotifications(data.notifications)
            })
    }, [localStorageData.token])

    useEffect(() => {
        getAdminInfo()
    }, [getAdminInfo])


    const readMsg = (e, id) => {
        if (e.target.checked) {
            fetch(`http://localhost:4000/v1/notifications/see/${id}`, {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${localStorageData.token}`
                },
                body: JSON.stringify({ email: adminInfo.email })

            }).then(res => res.json())
                .then(data => {
                    getAdminInfo()
                })
        }
    }

    const notificationCount = adminInfo.notifications ? adminInfo.notifications.length : 0

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
