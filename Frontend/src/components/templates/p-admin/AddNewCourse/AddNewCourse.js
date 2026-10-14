import { useEffect, useState } from 'react'
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
            <section className="card admin-form">
                <div className="admin-form__header">
                    <span className="icon-badge"><i className="fa-solid fa-plus"></i></span>
                    <h2 className="h5 fw-bold mb-0">Add New Course</h2>
                </div>
                <form className="admin-form__body" onSubmit={(e) => e.preventDefault()}>
                    <div className='row g-3'>
                        <div className="col-12 col-md-6">
                            <div>
                                <Input
                                    isValid={name.isValid}
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
                        <div className="col-12 col-md-6">
                            <Input
                                isValid={shortName.isValid}
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
                        <div className="col-12 col-md-6">
                            <Input
                                isValid={price.isValid}
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
                        <div className="col-12 col-md-6">
                            <div>
                                <select className="form-select" onChange={(e) => setCtegoryId(e.target.value)}>
                                    <option value="-1">Please Select Category </option>
                                    {allCategories.length && allCategories.map((item, index) => (
                                        <option key={index} value={item._id}>{item.title} </option>
                                    ))

                                    }
                                </select>
                            </div>
                        </div>
                        <div className="col-12 col-md-6">
                            <Input
                                isValid={support.isValid}
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
                        <div className="col-12 col-md-6">
                            <input type="file" className="form-control" id="cover-course" aria-label="Upload file" onChange={(e) => setCover(e.target.files[0])} />
                        </div>
                        <div className="col-12 col-md-6">
                            <fieldset className="d-flex flex-wrap align-items-center gap-3 h-100">
                                <legend className="form-label fs-6 mb-0 w-auto float-none">Course Status:</legend>
                                <div className="form-check form-check-inline">
                                    <input className="form-check-input" type="radio" value="presell" name="course-status" id="course-status-presell"
                                        onInput={(e) => setStatus(e.target.value)} />
                                    <label className="form-check-label" htmlFor="course-status-presell">Presell</label>
                                </div>
                                <div className="form-check form-check-inline">
                                    <input className="form-check-input" type="radio" value="start" name="course-status" id="course-status-start"
                                        onInput={(e) => setStatus(e.target.value)} />
                                    <label className="form-check-label" htmlFor="course-status-start">Start</label>
                                </div>
                            </fieldset>
                        </div>
                        <div className="col-12">
                            <Input
                                isValid={description.isValid}
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
                    className={`btn ${formState.isFormValid ? "btn-primary" : "btn-secondary"} d-inline-flex align-items-center gap-2`}
                    disabled={!formState.isFormValid}
                    type="submit"
                    actionForm={(e) => addNewCourse(e)}>
                    <span>Create New Course</span>
                    <i className="fa fa-plus"></i>
                </Button>
            </section>
        </>
    )
}
