import { useCallback, useEffect, useState } from 'react'
import "./Topbar.css"
import { Link } from 'react-router-dom';
import Modal from 'react-bootstrap/Modal';


export default function Topbar() {
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
                    console.log(data);
                    getAdminInfo()
                })
        }
    }


    return (
        <>
            <div className='topbar'>
                <div className='topbar-wrapper'>
                    
                    <div className='topbar-right'>
                        <div className='topbarIcon-container' onClick={() => setShow(true)}>
                            <i className="fa-solid fa-bell"></i>
                            {adminInfo.notifications ?
                                <span>{adminInfo.notifications.length}</span> : <span>0</span>
                            }
                        </div>
                        <Modal show={show} onHide={handleClose}>
                            <Modal.Header closeButton>
                                <Modal.Title>your message</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                {notifications.length ? notifications.map(note => (
                                    <div key={note._id} className="form-check form-switch">
                                        <input className="form-check-input" type="checkbox" id={note._id}
                                            onChange={(e) => readMsg(e, note._id)} />
                                        <label className="form-check-label" htmlFor={note._id}>{note.msg}</label>
                                    </div>
                                )) : <div className='alert alert-warning'>there isn't any notification</div>}
                            </Modal.Body>
                        </Modal>

                        <div className='topbarIcon-container'>
                            <i className="fa-solid fa-earth-americas"></i>
                        </div>

                        <div className='topbarIcon-container'>
                            <i className="fa-solid fa-gear"></i>
                        </div>

                        <img src={adminInfo.profile} alt="" />
                        <span className='topbar-name'>{adminInfo.name}</span>
                    </div>

                </div>
            </div>
        </>
    )
}
