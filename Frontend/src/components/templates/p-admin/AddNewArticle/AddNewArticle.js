import { useState, useEffect } from 'react'
import useForm from '../../../../Hooks/useForm'
import Input from '../../../modules/Form/Input'
import "./AddNewArticle.css"
import Button from '../../../modules/Form/Button'
import { requiredValidator, minValidator, maxValidator } from '../../../../validators/rules'
import swal from 'sweetalert'
import Editor from '../../../modules/Form/Editor'



export default function AddNewArticle({ getAllArticles }) {
    const [categories, setCategories] = useState([])
    const [categoryId, setCategoryId] = useState("")
    const [cover, setCover] = useState("")
    const [content, setContent] = useState("")


    const [formState, changeInputHandeler] = useForm(
        {
            title:
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



        },
        false)

    let { title, description, shortName } = formState.inputs


    useEffect(() => {
        fetch("http://localhost:4000/v1/category")
            .then(res => res.json())
            .then(data => {
                setCategories(data)
            })
    }, [])

    const formdata = new FormData()
    formdata.append("title", title.value)
    formdata.append("shortName", shortName.value)
    formdata.append("categoryID", categoryId)
    formdata.append("body", content)
    formdata.append("cover", cover)
    formdata.append("description", description.value)


    const addNewArticle = () => {
        const getFromLocalStorage = JSON.parse(localStorage.getItem("userData"))

        fetch("http://localhost:4000/v1/articles", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${getFromLocalStorage.token}`
            },
            body: formdata
        }).then(res => {
            if (res.ok) {
                swal({
                    title: "the article was created successfully",
                    icon: "success",
                    buttons: "ok"
                }).then(result => {

                })
                getAllArticles()
            }
        })

    }

    const addNewDraft = () => {
        const getFromLocalStorage = JSON.parse(localStorage.getItem("userData"))

        fetch("http://localhost:4000/v1/articles/draft", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${getFromLocalStorage.token}`
            },
            body: formdata
        }).then(res => {
            if (res.ok) {
                swal({
                    title: "the article was Drafted successfully",
                    icon: "success",
                    buttons: "ok"
                }).then(result => {

                })
                getAllArticles()
            }
        })

    }

    return (
        <>
            <div className="form-container">
                <div className='form-header'>
                    <i className="fa-solid fa-plus"></i>
                    <h1>Add New Article</h1>
                </div>
                <form className="form">
                    <div className='row'>
                        <div className="col-6">
                            <Input
                                isValid={title.isValid}
                                className="register-form__username-input"
                                placeholder="Title"
                                type="input"
                                onChangeInput={(e) =>
                                    changeInputHandeler(e, "title", [
                                        requiredValidator(),
                                        maxValidator(20),
                                        minValidator(6),

                                    ])}
                            />
                        </div>
                        <div className="col-6">
                            <Input
                                isValid={shortName.isValid}
                                className="register-form__username-input"
                                placeholder="Link"
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
                            <div className="categories">
                                <select className="category-list" onChange={(e) => setCategoryId(e.target.value)}>
                                    <option value="-1">Please Select Category </option>
                                    {categories.length && categories.map((item, index) => (
                                        <option key={index} value={item._id}>{item.title} </option>
                                    ))

                                    }
                                </select>
                                <span className="error-message text-danger"></span>
                            </div>
                        </div>
                        <div className='col-6'>
                            <div className="file">
                                <label style={{ color: "var(--dark-color)" }} className="input-title" htmlFor='cover-course'><i className='fa fa-plus' style={{ marginRight: "2rem", display: "inline-block" }}></i>{cover.name}</label>
                                <input type="file" id="cover-course" style={{ display: "none" }} onChange={(e) => setCover(e.target.files[0])} />
                            </div>
                        </div>
                        <div className="col-12">
                            <Input
                                isValid={description.isValid}
                                className="description-course"
                                placeholder="writte...."
                                onChangeInput={(e) =>
                                    changeInputHandeler(e, "description", [
                                        requiredValidator(),
                                        maxValidator(200),
                                        minValidator(6),

                                    ])}

                            />
                        </div>
                        <div className='col-12'>
                            <Editor setContent={setContent} />
                        </div>
                    </div>
                </form>
                <div className='container-buttons'>
                    <Button
                        className={`form__btn ${formState.isFormValid ? "active" : null}`}
                        disabled={!formState.isFormValid}
                        type="submit"
                        actionForm={(e) => addNewArticle(e)}>
                        <span className="form__btn-text">Create New Article</span>
                        <i className="fa fa-plus form__btn-icon"></i>
                    </Button>
                    <Button
                        className={`form__btn ${formState.isFormValid ? "active" : null}`}
                        disabled={!formState.isFormValid}
                        type="submit"
                        actionForm={(e) => addNewDraft(e)}>
                        <span className="form__btn-text">Create New Draft</span>
                        <i className="fa fa-plus form__btn-icon"></i>
                    </Button>
                </div>
            </div>
        </>
    )
}
