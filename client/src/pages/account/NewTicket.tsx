import { Link, useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { FaPaperPlane } from "react-icons/fa6"
import Input from "../../components/ui/Input"
import { COURSE_SUB_DEPARTMENT, ticketSchema } from "../../validators"
import type { TicketFormValues } from "../../validators"
import { useCreateTicket, useDepartmentSubs, useDepartments } from "../../features/tickets/hooks"
import { enrolledCourse, useMyCourses } from "../../features/users/hooks"


const defaultValues: TicketFormValues = { title: "", departmentID: "", departmentSubID: "", priority: "", courseId: "", body: "" }

export default function NewTicket() {
    const navigate = useNavigate()
    const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
        resolver: zodResolver(ticketSchema),
        defaultValues,
        mode: "onTouched",
    })
    const createTicket = useCreateTicket(() => navigate("/my-account/tickets"))

    const departmentID = watch("departmentID")
    const departmentSubID = watch("departmentSubID")
    const { data: departments = [] } = useDepartments()
    const { data: subDepartments = [] } = useDepartmentSubs(departmentID)

    const { data: myCourses, isLoading: coursesLoading } = useMyCourses({ limit: 50 })
    const enrolled = (myCourses?.items ?? []).map(enrolledCourse).filter(course => course !== undefined)
    return (
        <>
            <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-4">
                <h2 className="h4 fw-bold mb-0">New Ticket</h2>
                <Link className="btn btn-outline-primary" to="/my-account/tickets">All tickets</Link>
            </div>
            <form className="row g-3" onSubmit={handleSubmit(data => createTicket.mutate({ ...data, course: data.courseId || undefined }))} noValidate>
                <div className="col-12 col-md-6">
                    <label className="form-label" htmlFor="ticket-title">Title</label>
                    <Input id="ticket-title" placeholder="Title" {...register("title")} error={errors.title?.message} />
                </div>
                <div className="col-12 col-md-6">
                    <label className="form-label" htmlFor="ticket-department">Department</label>
                    <Input as="select" id="ticket-department" error={errors.departmentID?.message}
                        {...register("departmentID", { onChange: () => setValue("departmentSubID", "") })}>
                        <option value="">Select a department</option>
                        {departments.map(item => <option key={item._id} value={item._id}>{item.title}</option>)}
                    </Input>
                </div>
                <div className="col-12 col-md-6">
                    <label className="form-label" htmlFor="ticket-sub">Sub department</label>
                    <Input as="select" id="ticket-sub" disabled={!departmentID} {...register("departmentSubID")} error={errors.departmentSubID?.message}>
                        <option value="">Select a sub department</option>
                        {subDepartments.map(item => <option key={item._id} value={item._id}>{item.title}</option>)}
                    </Input>
                </div>
                <div className="col-12 col-md-6">
                    <label className="form-label" htmlFor="ticket-priority">Priority</label>
                    <Input as="select" id="ticket-priority" {...register("priority")} error={errors.priority?.message}>
                        <option value="">Select a priority</option>
                        <option value="3">High</option>
                        <option value="2">Medium</option>
                        <option value="1">Low</option>
                    </Input>
                </div>
                {departmentSubID === COURSE_SUB_DEPARTMENT &&
                    <div className="col-12 col-md-6">
                        <label className="form-label" htmlFor="ticket-course">Course</label>
                        <Input as="select" id="ticket-course" {...register("courseId")} error={errors.courseId?.message}>
                            <option value="">Select a course</option>
                            {coursesLoading ?
                                <option disabled>Loading your courses…</option> :
                                enrolled.length ?
                                    enrolled.map(course => <option key={course._id} value={course._id}>{course.name}</option>) :
                                    <option disabled>You haven't enrolled in any course yet</option>}
                        </Input>
                    </div>}
                <div className="col-12">
                    <label className="form-label" htmlFor="ticket-body">Message</label>
                    <Input as="textarea" id="ticket-body" rows={6} placeholder="Describe your issue" {...register("body")} error={errors.body?.message} />
                </div>
                <div className="col-12">
                    <button type="submit" className="btn btn-primary d-inline-flex align-items-center gap-2" disabled={createTicket.isPending}>
                        <FaPaperPlane /> Send ticket
                    </button>
                </div>
            </form>
        </>
    )
}
