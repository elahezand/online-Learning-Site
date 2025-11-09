import { useState, useCallback, useEffect } from 'react'
import Button from '../../components/modules/Form/Button'
import "../../styles/p-user/new-ticket.css"
import { useNavigate } from 'react-router-dom'
import swal from 'sweetalert'
import { Link } from 'react-router-dom'
import getMe from '../../utils/auth'


export default function AddNewTicket() {
    const navigate = useNavigate()

    const [departments, setDepartments] = useState([])
    const [departmentSub, setDepartmentSub] = useState([])

    const [departmentId, setDepartmentId] = useState("")
    const [departmentSubId, setDepartmentSubId] = useState("")
    const [courseId, setCourseId] = useState("")

    const [coursesUser, setCoursesUser] = useState([])
    const [title, setTitle] = useState("")
    const [body, setBody] = useState("")
    const [priority, setPriority] = useState("")

    const getSubDepartment = async (e) => {
        const res = await fetch(`http://localhost:4000/v1/tickets/departments-subs/${e.target.value}`)
        if (res.ok) {
            const data = await res.json()
            setDepartmentSub(data)
        }

    }

    const getDepartment = async () => {
        const res = await fetch(`http://localhost:4000/v1/tickets/departments`)
        if (res.ok) {
            const data = await res.json()
            setDepartments(data)
        }

    }

    const getUserCourses = async () => {
        const token = await getMe()
        if (token) {
            const res = await fetch("http://localhost:4000/v1/users/courses", {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token} `
                }
            })
            if (res.ok) {
                const data = await res.json()
                setCoursesUser(data)
            }

        }
    }

    useEffect(() => {
        getDepartment()
        getSubDepartment()
        getUserCourses()
    }, [])

    const addNewTicket = async () => {
        const token = await getMe()
        if (token) {
            const res = await fetch("http://localhost:4000/v1/tickets", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token} `,
                    "Content-Type": "application/json"

                },
                body: JSON.stringify({
                    departmentID: departmentId,
                    departmentSubID: departmentSubId,
                    title: title,
                    body: body,
                    priority: priority,
                    courseId: courseId

                })
            })
            if (res.ok) {
                swal({
                    title: "your ticket was sended successfully",
                    icon: "success",
                    buttons: "ok"
                }).then(result => {
                    if (result) {
                        navigate("/my-account/tickets/1")
                    }
                })
            }

        }
    }

    return (
        <>
            <div className="ticket-header">
                <Link className="ticket-header__link" to="/my-account/tickets/1">
                    All Tickets
                </Link>
            </div>
            <form className="form">
                <div className='row'>
                    <div className="col-6">
                        <div className="input-form">
                            <input
                                onChange={(e) => setTitle(e.target.value)}
                                className="input-form_title"
                                placeholder="Title"
                            />
                        </div>
                    </div>
                    <div className="col-6">
                        <div className="input-form">
                            <select className="input-list"
                                onChange={(e) => {
                                    setDepartmentId(e.target.value)
                                    getSubDepartment(e)
                                }}>
                                <option value="-1">Please Select Department </option>
                                {departments.length && departments.map((item, index) => (
                                    <option
                                        key={index}
                                        value={item._id}>
                                        {item.title}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="col-6">
                        <div className="input-form">
                            <select className="input-list"
                                onChange={(e) => setDepartmentSubId(e.target.value)}>
                                <option value="-1">Please Select SubDepartment </option>
                                {departmentSub.length > 0 && departmentSub.map((item, index) => (
                                    <option
                                        key={index}
                                        value={item._id}>
                                        {item.title}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="col-6">
                        <div className="input-form">
                            <select className="input-list"
                                onChange={(e) => setPriority(e.target.value)}>
                                <option value="-1">Please Select Priority</option>
                                <option value="3">High Priority</option>
                                <option value="2">Medium Priority</option>
                                <option value="1">Low Priority</option>
                            </select>
                        </div>
                    </div>
                    {departmentSubId === "63b688c5516a30a651e98156" ?
                        <div className="col-6">
                            <div className="input-form">
                                <select className="input-list"
                                    onChange={(e) => setCourseId(e.target.value)}>
                                    <option value="-1">Please Select Courses </option>
                                    {coursesUser.length ? coursesUser.map(course => (
                                        <option value={course._id}>{course.course.name}</option>
                                    )) : null}
                                </select>
                            </div>
                        </div>
                        : null}
                    <div className="col-12">
                        <textarea
                            className="texterea"
                            placeholder="writte...."
                            onChange={(e) => setBody(e.target.value)} />
                    </div>
                </div>
            </form>
            <Button
                className="form__btn active"
                type="submit"
                actionForm={(e) => addNewTicket(e)}>
                <span className="form__btn-text">Add New Ticket</span>
                <i className="fa fa-plus form__btn-icon"></i>
            </Button>
        </>
    )
}



