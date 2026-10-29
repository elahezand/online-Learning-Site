import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { FaPlus } from "react-icons/fa6"
import Input from "../../components/ui/Input"
import FormCard from "../../components/ui/FormCard"
import { sessionSchema } from "../../validators"
import type { SessionFormValues } from "../../validators"
import type { SessionData } from "../../validators"
import { useCourseOptions, useCreateSession } from "./hooks"

const defaultValues: SessionFormValues = { title: "", time: "", course: "", free: "0", video: "" }

const ACCESS = [["0", "Paid"], ["1", "Free"]]

export default function AddSessionForm() {
    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        resolver: zodResolver(sessionSchema),
        defaultValues,
        mode: "onTouched",
    })
    const { data: courses = [] } = useCourseOptions()
    const createSession = useCreateSession(() => reset())

    const onSubmit = ({ title, time, course, free, video }: SessionData) => {
        const formData = new FormData()
        formData.append("course", course)
        formData.append("title", title)
        formData.append("time", time)
        formData.append("free", free)
        formData.append("video", video)
        createSession.mutate(formData)
    }

    return (
        <FormCard icon={<FaPlus />} title="Add New Session">
            <form className="d-grid gap-3" onSubmit={handleSubmit(onSubmit)} noValidate>
                <div className="row g-3">
                    <div className="col-12 col-md-6">
                        <Input placeholder="Title" aria-label="Title" {...register("title")} error={errors.title?.message} />
                    </div>
                    <div className="col-12 col-md-6">
                        <Input as="select" aria-label="Course" {...register("course")} error={errors.course?.message}>
                            <option value="">Select a course</option>
                            {courses.map(item => <option key={item._id} value={item._id}>{item.name}</option>)}
                        </Input>
                    </div>
                    <div className="col-12 col-md-6">
                        <Input placeholder="Time, e.g. 12:30" aria-label="Time" {...register("time")} error={errors.time?.message} />
                    </div>
                    <div className="col-12 col-md-6">
                        <Input type="file" accept="video/*" aria-label="Video" {...register("video")} error={errors.video?.message} />
                    </div>
                    <div className="col-12 col-md-6">
                        <fieldset className="d-flex flex-wrap align-items-center gap-3 h-100">
                            <legend className="form-label fs-6 mb-0 w-auto float-none">Access:</legend>
                            {ACCESS.map(([value, label]) => (
                                <div className="form-check form-check-inline" key={value}>
                                    <input className="form-check-input" type="radio" id={`session-free-${value}`} value={value} {...register("free")} />
                                    <label className="form-check-label" htmlFor={`session-free-${value}`}>{label}</label>
                                </div>
                            ))}
                        </fieldset>
                    </div>
                </div>
                <div>
                    <button type="submit" className="btn btn-primary d-inline-flex align-items-center gap-2" disabled={createSession.isPending}>
                        <FaPlus /> Create session
                    </button>
                </div>
            </form>
        </FormCard>
    )
}