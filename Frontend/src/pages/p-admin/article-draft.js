import { useState, useEffect, useCallback } from 'react'
import "../../styles/p-admin/article-draft.css"
import Button from "../../components/modules/Form/Button"
import Editor from "../../components/modules/Form/Editor"
import swal from 'sweetalert'
import { useParams } from 'react-router-dom'
import getMe from '../../utils/auth'

export default function ArticlesPanel() {
    const params = useParams()

    const [title, setTitle] = useState("")
    const [content, setContent] = useState("")
    const [shortName, setShortName] = useState("")
    const [categoryId, setCategoryId] = useState("")
    const [description, setDescription] = useState("")
    const [cover, setCover] = useState("")


    const getSingleArticle = useCallback(async () => {
        const token = await getMe()
        if (token) {
            const res = await fetch(`http://localhost:4000/v1/articles/${params.shortName}`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            if (res.ok) {
                const data = await res.json()
                setTitle(data.title)
                setContent(data.body)
                setCategoryId(data.categoryID._id)
                setDescription(data.description)
                setShortName(data.shortName)
            }
        }
    }, [params.shortName])


    useEffect(() => {
        getSingleArticle()
    }, [getSingleArticle])


    const formdata = new FormData()
    formdata.append("title", title)
    formdata.append("shortName", shortName)
    formdata.append("categoryID", categoryId)
    formdata.append("body", content)
    formdata.append("cover", cover)
    formdata.append("description", description)

    const addNewArticle = async () => {
        const token = await getMe()
        const res = await fetch("http://localhost:4000/v1/articles", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`

            },
            body: formdata
        })

        if (res.ok) {
            swal({
                title: "the article was Drafted successfully",
                icon: "success",
                buttons: "ok"
            }).then(result => {
                if (result) {

                }
            })
        }
    }

    const addNewDraft = async () => {
        const token = await getMe()
        if (token) {
            fetch("http://localhost:4000/v1/articles/draft", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`
                },
                body: formdata
            }).then(res => {
                if (res.ok) {
                    swal({
                        title: "the article was Drafted successfully",
                        icon: "success",
                        buttons: "ok"
                    })
                }
            })
        }
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
                            <input
                                value={title}
                                className="register-form__username-input"
                                placeholder="Title"
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </div>
                        <div className="col-6">
                            <input
                                value={shortName}
                                className="register-form__username-input"
                                placeholder="Link"
                                type="input"
                                onChange={(e) => setShortName(e.target.value)}
                            />
                        </div>

                        <div className='col-6'>
                            <div className="file">
                                <label style={{ color: "var(--dark-color)" }}
                                    className="input-title" htmlFor='cover-course'>
                                    <i className='fa fa-plus'
                                        style={{ marginRight: "2rem", display: "inline-block" }} />
                                    {cover.name}</label>
                                <input type="file"
                                    id="cover-course" style={{ display: "none" }}
                                    onChange={(e) => setCover(e.target.files[0])} />
                            </div>
                        </div>

                        <div className="col-12">
                            <textarea
                                value={description}
                                className="description-article"
                                placeholder="writte...."
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>
                        <div className='col-12'>
                            <Editor value={content} setContent={setContent} />
                        </div>
                    </div>
                </form>
                <div className='container-buttons'>
                    <Button
                        className="form__btn active"
                        type="submit"
                        actionForm={(e) => addNewArticle(e)}>
                        <span className="form__btn-text">Create New Article</span>
                        <i className="fa fa-plus form__btn-icon"></i>
                    </Button>
                    <Button
                        className="form__btn active"
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
