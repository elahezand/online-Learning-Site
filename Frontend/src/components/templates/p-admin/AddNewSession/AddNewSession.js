import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { coursesApi, queryKeys, useCourses } from '../../../../api'
import useForm from '../../../../Hooks/useForm'
import Input from '../../../modules/Form/Input'
import Button from '../../../modules/Form/Button'
import { minValidator} from "../../../../validators/rules"
import swal from 'sweetalert'
import { notifyError } from '../../../../utils/notify'

export default function AddNewSession() {
    const [status, setStatus] = useState(0)
    const [video, setVideo] = useState("")
    const [courseId, setCourseId] = useState("")

    const [formState, changeInputHandeler] = useForm(
        {
            title:
            {
                value: "",
                isValid: false
            },
            time:
            {
                value: "",
                isValid: false
            },


        },
        false)

    let { title, time } = formState.inputs

    const { data: allCourses = [] } = useCourses()
    const queryClient = useQueryClient()

    const createSession = useMutation({
        mutationFn: ({ courseId, formData }) => coursesApi.createSession(courseId, formData),
        onSuccess: () => {
            swal({ title: "the session was created successfully", icon: "success", buttons: "ok" })
            queryClient.invalidateQueries({ queryKey: queryKeys.sessions })
        },
        onError: (err) => notifyError(err, "The session could not be created"),
    })

    const addNewSession = () => {
        const formData = new FormData()
        formData.append("title", title.value)
        formData.append("time", time.value)
        formData.append("free", status)
        formData.append("video", video)
        createSession.mutate({ courseId, formData })
    }
    return (
        <>
            <section className="card admin-form">
                <div className="admin-form__header">
                    <span className="icon-badge"><i className="fa-solid fa-plus"></i></span>
                    <h2 className="h5 fw-bold mb-0">Add New Session</h2>
                </div>
                <form className="admin-form__body" onSubmit={(e) => e.preventDefault()}>
                    <div className='row g-3'>
                        <div className="col-12 col-md-6">
                            <div>
                                <Input
                                    isValid={title.isValid}
                                    placeholder="Title"
                                    type="input"
                                    onChangeInput={(e) =>
                                        changeInputHandeler(e, "title", [
                                            minValidator(6),
                                        ])}
                                />
                            </div>
                        </div>
                        <div className="col-12 col-md-6">
                            <div>
                                <select className="form-select" onChange={(e) => setCourseId(e.target.value)}>
                                    <option value="-1">Please Select Course </option>
                                    {allCourses.length && allCourses.map((item, index) => (
                                        <option key={index} value={item._id}>{item.name} </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="col-12 col-md-6">
                            <Input
                                isValid={time.isValid}
                                placeholder="Time"
                                type="input"
                                onChangeInput={(e) =>
                                    changeInputHandeler(e, "time", [
                                        minValidator(4),
                                    ])}

                            />
                        </div>
                        <div className="col-12 col-md-6">
                            <input type="file" className="form-control" id="cover-course" aria-label="Upload file" onChange={(e) => setVideo(e.target.files[0])} />
                        </div>

                        <div className="col-12 col-md-6">
                            <fieldset className="d-flex flex-wrap align-items-center gap-3 h-100">
                                <legend className="form-label fs-6 mb-0 w-auto float-none">Session Status:</legend>
                                <div className="form-check form-check-inline">
                                    <input className="form-check-input" type="radio" value="0" name="session-status" id="session-status-0"
                                        onInput={(e) => setStatus(e.target.value)} />
                                    <label className="form-check-label" htmlFor="session-status-0">Free</label>
                                </div>
                                <div className="form-check form-check-inline">
                                    <input className="form-check-input" type="radio" value="1" name="session-status" id="session-status-1"
                                        onInput={(e) => setStatus(e.target.value)} />
                                    <label className="form-check-label" htmlFor="session-status-1">Price</label>
                                </div>
                            </fieldset>
                        </div>
                    </div>
                </form>
                <Button
                    className={`btn ${formState.isFormValid ? "btn-primary" : "btn-secondary"} d-inline-flex align-items-center gap-2`}
                    disabled={!formState.isFormValid || createSession.isPending}
                    type="submit"
                    actionForm={(e) => addNewSession(e)}>
                    <span>Create New Course</span>
                    <i className="fa fa-plus"></i>
                </Button>
            </section>
        </>
    )
}
