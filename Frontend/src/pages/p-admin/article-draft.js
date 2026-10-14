import { useState, useEffect, useCallback } from 'react'
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

            <section className="card admin-form">
                <div className="admin-form__header">
                    <span className="icon-badge"><i className="fa-solid fa-plus"></i></span>
                    <h2 className="h5 fw-bold mb-0">Add New Article</h2>
                </div>
                <form className="admin-form__body" onSubmit={(e) => e.preventDefault()}>
                    <div className='row g-3'>
                        <div className="col-12 col-md-6">
                            <input
                                value={title}
                                className="form-control"
                                placeholder="Title"
                                aria-label="Title"
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </div>
                        <div className="col-12 col-md-6">
                            <input
                                value={shortName}
                                className="form-control"
                                placeholder="Link"
                                aria-label="Link"
                                type="input"
                                onChange={(e) => setShortName(e.target.value)}
                            />
                        </div>

                        <div className="col-12 col-md-6">
                            <input type="file" className="form-control" id="cover-course" aria-label="Upload file" onChange={(e) => setCover(e.target.files[0])} />
                        </div>

                        <div className="col-12">
                            <textarea
                                value={description}
                                className="form-control"
                                rows={5}
                                placeholder="writte...."
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>
                        <div className='col-12'>
                            <Editor value={content} setContent={setContent} />
                        </div>
                    </div>
                </form>
                <div className='d-flex flex-wrap gap-2'>
                    <Button
                        className="btn btn-primary d-inline-flex align-items-center gap-2"
                        type="submit"
                        actionForm={(e) => addNewArticle(e)}>
                        <span>Create New Article</span>
                        <i className="fa fa-plus"></i>
                    </Button>
                    <Button
                        className="btn btn-primary d-inline-flex align-items-center gap-2"
                        type="submit"
                        actionForm={(e) => addNewDraft(e)}>
                        <span>Create New Draft</span>
                        <i className="fa fa-plus"></i>
                    </Button>
                </div>
            </section>
        </>
    )
}
