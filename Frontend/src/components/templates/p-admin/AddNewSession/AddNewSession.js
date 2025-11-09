import  { useEffect, useState } from 'react'
import useForm from '../../../../Hooks/useForm'
import Input from '../../../modules/Form/Input'
import Button from '../../../modules/Form/Button'
import { minValidator} from "../../../../validators/rules"
import swal from 'sweetalert'

export default function AddNewSession({ getAllSessions }) {
    const [status, setStatus] = useState(0)
    const [video, setVideo] = useState("")
    const [allCourses, setAllCourses] = useState([])
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

    useEffect(() => {
        const getFromLocalStorage = JSON.parse(localStorage.getItem("userData"))

        fetch("http://localhost:4000/v1/courses", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${getFromLocalStorage.token}`
            }
        }).then(res => res.json())
            .then(data => {
                setAllCourses(data)
            })
    }, [])


    const formData = new FormData()
    formData.append("title", title.value)
    formData.append("time", time.value)
    formData.append("free", status)
    formData.append("video", video)

    const addNewSession = () => {
        const getFromLocalStorage = JSON.parse(localStorage.getItem("userData"))

        fetch(`http://localhost:4000/v1/courses/${courseId}/sessions`, {
            method: 'POST',
            headers: {
                "Authorization": `Bearer ${getFromLocalStorage.token}`
            },
            body: formData
        }).then(res => {
            if (res.ok) {
                swal({
                    title: "the session was created successfully",
                    icon: "success",
                    buttons: "ok"
                }).then(result => {

                })
                getAllSessions()
            }
        })

    }
    return (
        <>
            <div className="form-container">
                <div className='form-header'>
                    <i className="fa-solid fa-plus"></i>
                    <h1>Add New Session</h1>
                </div>
                <form className="form">
                    <div className='row'>
                        <div className="col-6">
                            <div className="register-form__username">
                                <Input
                                    isValid={title.isValid}
                                    className="register-form__username-input"
                                    placeholder="Title"
                                    type="input"
                                    onChangeInput={(e) =>
                                        changeInputHandeler(e, "title", [
                                            minValidator(6),
                                        ])}
                                />
                            </div>
                        </div>
                        <div className="col-6">
                            <div className="categories register-form__username-input">
                                <select className="category-list" onChange={(e) => setCourseId(e.target.value)}>
                                    <option value="-1">Please Select Course </option>
                                    {allCourses.length && allCourses.map((item, index) => (
                                        <option key={index} value={item._id}>{item.name} </option>
                                    ))}
                                </select>
                                <span className="error-message text-danger"></span>
                            </div>
                        </div>
                        <div className="col-6">
                            <Input
                                isValid={time.isValid}
                                className="register-form__username-input"
                                placeholder="Time"
                                type="input"
                                onChangeInput={(e) =>
                                    changeInputHandeler(e, "time", [
                                        minValidator(4),
                                    ])}

                            />
                        </div>
                        <div className='col-6'>
                            <div className="file register-form__username-input">
                                <label style={{ color: "var(--dark-color)" }}
                                    className="input-title" htmlFor='cover-course'>
                                    <i className='fa fa-plus'
                                        style={{ marginRight: "2rem", display: "inline-block" }}>
                                    </i>{video.name}</label>
                                <input type="file" id="cover-course"
                                    style={{ display: "none" }}
                                    onChange={(e) => setVideo(e.target.files[0])} />
                            </div>
                        </div>

                        <div className="col-6">
                            <div className="presell">
                                <label className="input-title">Session Status:</label>
                                <div className="radios">
                                    <div className="presell-true">
                                        <label>
                                            <span>Free</span>
                                            <input type="radio" value="0" name="condition"
                                                onInput={(e) => setStatus(e.target.value)} />
                                        </label>
                                    </div>
                                    <div className="presell-false">
                                        <label>
                                            <span>Price</span>
                                            <input type="radio" value="1" name="condition"
                                                onInput={(e) => setStatus(e.target.value)} />
                                        </label>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </form>
                <Button
                    className={`form__btn ${formState.isFormValid ? "active" : null}`}
                    disabled={!formState.isFormValid}
                    type="submit"
                    actionForm={(e) => addNewSession(e)}>
                    <span className="form__btn-text">Create New Course</span>
                    <i className="fa fa-plus form__btn-icon"></i>
                </Button>
            </div>
        </>
    )
}
