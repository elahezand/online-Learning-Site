import { useState, useEffect } from 'react'
import Button from '../../components/modules/Form/Button'
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
        if (!e) return
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
            <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-4">
                <h1 className="h4 mb-0">New Ticket</h1>
                <Link className="btn btn-outline-primary" to="/my-account/tickets/1">
                    All Tickets
                </Link>
            </div>
            <form className="row g-3" onSubmit={(e) => e.preventDefault()}>
                <div className="col-12 col-md-6">
                    <label className="form-label" htmlFor="ticket-title">Title</label>
                    <input
                        id="ticket-title"
                        onChange={(e) => setTitle(e.target.value)}
                        className="form-control"
                        placeholder="Title"
                    />
                </div>
                <div className="col-12 col-md-6">
                    <label className="form-label" htmlFor="ticket-department">Department</label>
                    <select className="form-select" id="ticket-department"
                        onChange={(e) => {
                            setDepartmentId(e.target.value)
                            getSubDepartment(e)
                        }}>
                        <option value="-1">Please Select Department </option>
                        {departments.length ? departments.map((item, index) => (
                            <option
                                key={index}
                                value={item._id}>
                                {item.title}</option>
                        )) : null}
                    </select>
                </div>
                <div className="col-12 col-md-6">
                    <label className="form-label" htmlFor="ticket-sub">Sub department</label>
                    <select className="form-select" id="ticket-sub"
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
                <div className="col-12 col-md-6">
                    <label className="form-label" htmlFor="ticket-priority">Priority</label>
                    <select className="form-select" id="ticket-priority"
                        onChange={(e) => setPriority(e.target.value)}>
                        <option value="-1">Please Select Priority</option>
                        <option value="3">High Priority</option>
                        <option value="2">Medium Priority</option>
                        <option value="1">Low Priority</option>
                    </select>
                </div>
                {departmentSubId === "63b688c5516a30a651e98156" ?
                    <div className="col-12 col-md-6">
                        <label className="form-label" htmlFor="ticket-course">Course</label>
                        <select className="form-select" id="ticket-course"
                            onChange={(e) => setCourseId(e.target.value)}>
                            <option value="-1">Please Select Courses </option>
                            {coursesUser.length ? coursesUser.map(course => (
                                <option key={course._id} value={course._id}>{course.course.name}</option>
                            )) : null}
                        </select>
                    </div>
                    : null}
                <div className="col-12">
                    <label className="form-label" htmlFor="ticket-body">Message</label>
                    <textarea
                        id="ticket-body"
                        rows={6}
                        className="form-control"
                        placeholder="writte...."
                        onChange={(e) => setBody(e.target.value)} />
                </div>
                <div className="col-12">
                    <Button
                        className="btn btn-primary d-inline-flex align-items-center gap-2"
                        type="submit"
                        actionForm={(e) => addNewTicket(e)}>
                        <span>Add New Ticket</span>
                        <i className="fa fa-plus"></i>
                    </Button>
                </div>
            </form>
        </>
    )
}
