import { useState } from 'react'
import Button from '../../components/modules/Form/Button'
import { useNavigate } from 'react-router-dom'
import swal from 'sweetalert'
import { useQueryClient } from '@tanstack/react-query'
import { attempt, queryKeys, ticketsApi, useDepartments, useDepartmentSubs, useMyCourses } from '../../api'
import { Link } from 'react-router-dom'


export default function AddNewTicket() {
    const navigate = useNavigate()
    const queryClient = useQueryClient()


    const [departmentId, setDepartmentId] = useState("")
    const [departmentSubId, setDepartmentSubId] = useState("")
    const [courseId, setCourseId] = useState("")

    const [title, setTitle] = useState("")
    const [body, setBody] = useState("")
    const [priority, setPriority] = useState("")

    const { data: departments = [] } = useDepartments()
    const { data: departmentSub = [] } = useDepartmentSubs(departmentId)
    const { data: coursesUser = [] } = useMyCourses()

    const addNewTicket = async () => {
        const res = await attempt(ticketsApi.create({ departmentID: departmentId, departmentSubID: departmentSubId, title, body, priority, courseId }))
        if (res.ok) {
            queryClient.invalidateQueries({ queryKey: queryKeys.myTickets })
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
                            setDepartmentSubId("")
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
