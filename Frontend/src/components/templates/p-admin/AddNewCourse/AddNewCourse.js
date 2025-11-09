import { useEffect, useState } from 'react'
import "./AddNewCourse.css"
import Input from '../../../modules/Form/Input'
import Button from '../../../modules/Form/Button'
import useForm from '../../../../Hooks/useForm'
import { requiredValidator, minValidator, maxValidator } from '../../../../validators/rules'
import swal from 'sweetalert'

export default function AddNewCourse({ getAllCourses }) {
    const [status, setStatus] = useState("start")
    const [allCategories, setAllCategories] = useState([])
    const [categoryId, setCtegoryId] = useState("")
    const [cover, setCover] = useState("")

    const [formState, changeInputHandeler] = useForm(
        {
            name:
            {
                value: "",
                isValid: false
            },
            description:
            {
                value: "",
                isValid: false
            },

            shortName:
            {
                value: "",
                isValid: false
            },
            price:
            {
                value: "",
                isValid: false
            },
            support:
            {
                value: "",
                isValid: false
            }

        },
        false)

    let { name, description, shortName, price, support } = formState.inputs

    useEffect(() => {
        fetch("http://localhost:4000/v1/category")
            .then(res => res.json())
            .then(data => {
                setAllCategories(data)
            })
    }, [])

    const formData = new FormData();
    formData.append("name", name.value)
    formData.append("price", price.value)
    formData.append("description", description.value)
    formData.append("shortName", shortName.value)
    formData.append("categoryID", categoryId)
    formData.append("support", support.value)
    formData.append("status", status)
    formData.append("cover", cover)


    const addNewCourse = () => {
        const getFromLocalStorage = JSON.parse(localStorage.getItem("userData"))
        fetch(`http://localhost:4000/v1/courses`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${getFromLocalStorage.token}`,
            }, body: formData
        }).then(res => {
            if (res.ok) {
                swal({
                    title: "the course was created successfully",
                    icon: "success",
                    buttons: "ok"
                })
                getAllCourses()
            }
        })

    }

    return (
        <>
            <div className="form-container">
                <div className='form-header'>
                    <i className="fa-solid fa-plus"></i>
                    <h1>Add New Course</h1>
                </div>
                <form className="form">
                    <div className='row'>
                        <div className="col-6">
                            <div className="register-form__username">
                                <Input
                                    isValid={name.isValid}
                                    className="register-form__username-input"
                                    placeholder="name"
                                    type="input"
                                    onChangeInput={(e) =>
                                        changeInputHandeler(e, "name", [
                                            requiredValidator(),
                                            maxValidator(20),
                                            minValidator(6),

                                        ])}

                                />
                            </div>
                        </div>
                        <div className="col-6">
                            <Input
                                isValid={shortName.isValid}
                                className="register-form__username-input"
                                placeholder="course URL"
                                type="input"
                                onChangeInput={(e) =>
                                    changeInputHandeler(e, "shortName", [
                                        requiredValidator(),
                                        maxValidator(20),
                                        minValidator(6),

                                    ])}

                            />
                        </div>
                        <div className="col-6">
                            <Input
                                isValid={price.isValid}
                                className="register-form__username-input"
                                placeholder="price"
                                type="input"
                                onChangeInput={(e) =>
                                    changeInputHandeler(e, "price", [
                                        requiredValidator(),
                                        maxValidator(20),
                                        minValidator(6),

                                    ])}

                            />
                        </div>
                        <div className="col-6">
                            <div className="categories">
                                <select className="category-list" onChange={(e) => setCtegoryId(e.target.value)}>
                                    <option value="-1">Please Select Category </option>
                                    {allCategories.length && allCategories.map((item, index) => (
                                        <option key={index} value={item._id}>{item.title} </option>
                                    ))

                                    }
                                </select>
                                <span className="error-message text-danger"></span>
                            </div>
                        </div>
                        <div className="col-6">
                            <Input
                                isValid={support.isValid}
                                className="register-form__username-input"
                                placeholder="support"
                                type="input"
                                onChangeInput={(e) =>
                                    changeInputHandeler(e, "support", [
                                        requiredValidator(),
                                        maxValidator(20),
                                        minValidator(6),

                                    ])}

                            />
                        </div>
                        <div className='col-6'>
                            <div className="file">
                                <label style={{ color: "var(--dark-color)" }} className="input-title" htmlFor='cover-course'><i className='fa fa-plus' style={{ marginRight: "2rem", display: "inline-block" }}></i>{cover.name}</label>
                                <input type="file" id="cover-course" style={{ display: "none" }} onChange={(e) => setCover(e.target.files[0])} />
                            </div>
                        </div>
                        <div className="col-6">
                            <div className="presell">
                                <label className="input-title">Course Status:</label>
                                <div className="radios">
                                    <div className="presell-true">
                                        <label>
                                            <span>Presell</span>
                                            <input type="radio" value="presell" name="condition"
                                                onInput={(e) => setStatus(e.target.value)} />
                                        </label>
                                    </div>
                                    <div className="presell-false">
                                        <label>
                                            <span>Start</span>
                                            <input type="radio" value="start" name="condition"
                                                onInput={(e) => setStatus(e.target.value)} />
                                        </label>
                                    </div>

                                </div>
                            </div>
                        </div>
                        <div className="col-12">
                            <Input
                                isValid={description.isValid}
                                className="description-course"
                                placeholder="writte description...."
                                onChangeInput={(e) =>
                                    changeInputHandeler(e, "description", [
                                        requiredValidator(),
                                        maxValidator(20),
                                        minValidator(6),

                                    ])}

                            />
                        </div>
                    </div>
                </form>
                <Button
                    className={`form__btn ${formState.isFormValid ? "active" : null}`}
                    disabled={!formState.isFormValid}
                    type="submit"
                    actionForm={(e) => addNewCourse(e)}>
                    <span className="form__btn-text">Create New Course</span>
                    <i className="fa fa-plus form__btn-icon"></i>
                </Button>
            </div>
        </>
    )
}
