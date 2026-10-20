import { useState, useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { articlesApi, attempt, queryKeys, useArticle } from '../../api'
import Button from "../../components/modules/Form/Button"
import Editor from "../../components/modules/Form/Editor"
import swal from 'sweetalert'
import { useParams } from 'react-router-dom'

export default function ArticleDraft() {
    const params = useParams()

    const [title, setTitle] = useState("")
    const [content, setContent] = useState("")
    const [shortName, setShortName] = useState("")
    const [categoryId, setCategoryId] = useState("")
    const [description, setDescription] = useState("")
    const [cover, setCover] = useState("")


    const { data: article } = useArticle(params.shortName)
    const queryClient = useQueryClient()

    // Fill the form once the draft has loaded; the fields are editable afterwards
    useEffect(() => {
        if (!article) return
        setTitle(article.title ?? "")
        setContent(article.body ?? "")
        setCategoryId(article.categoryID?._id ?? "")
        setDescription(article.description ?? "")
        setShortName(article.shortName ?? "")
    }, [article])

    const buildFormData = () => {
        const formdata = new FormData()
        formdata.append("title", title)
        formdata.append("shortName", shortName)
        formdata.append("categoryID", categoryId)
        formdata.append("body", content)
        formdata.append("cover", cover)
        formdata.append("description", description)
        return formdata
    }

    const addNewArticle = async () => {
        const res = await attempt(articlesApi.publish(buildFormData()))
        if (res.ok) {
            queryClient.invalidateQueries({ queryKey: queryKeys.articles })
            swal({ title: "the article was published successfully", icon: "success", buttons: "ok" })
        }
    }

    const addNewDraft = async () => {
        const res = await attempt(articlesApi.saveDraft(buildFormData()))
        if (res.ok) {
            queryClient.invalidateQueries({ queryKey: queryKeys.articles })
            swal({ title: "the article was Drafted successfully", icon: "success", buttons: "ok" })
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
