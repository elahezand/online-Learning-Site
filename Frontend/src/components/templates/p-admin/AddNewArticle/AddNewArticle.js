import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { articlesApi, queryKeys, useCategories } from '../../../../api'
import useForm from '../../../../Hooks/useForm'
import Input from '../../../modules/Form/Input'
import Button from '../../../modules/Form/Button'
import { requiredValidator, minValidator, maxValidator } from '../../../../validators/rules'
import swal from 'sweetalert'
import Editor from '../../../modules/Form/Editor'
import { notifyError } from '../../../../utils/notify'



export default function AddNewArticle() {
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


    const { data: categories = [] } = useCategories()
    const queryClient = useQueryClient()

    const buildFormData = () => {
        const formdata = new FormData()
        formdata.append("title", title.value)
        formdata.append("shortName", shortName.value)
        formdata.append("categoryID", categoryId)
        formdata.append("body", content)
        formdata.append("cover", cover)
        formdata.append("description", description.value)
        return formdata
    }

    const saveArticle = useMutation({
        mutationFn: ({ draft }) => (draft ? articlesApi.saveDraft : articlesApi.publish)(buildFormData()),
        onSuccess: (_, { draft }) => {
            swal({
                title: draft ? "the article was Drafted successfully" : "the article was created successfully",
                icon: "success",
                buttons: "ok"
            })
            queryClient.invalidateQueries({ queryKey: queryKeys.articles })
        },
        onError: (err) => notifyError(err, "The article could not be saved"),
    })

    const addNewArticle = () => saveArticle.mutate({ draft: false })
    const addNewDraft = () => saveArticle.mutate({ draft: true })

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
                            <Input
                                isValid={title.isValid}
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
                        <div className="col-12 col-md-6">
                            <Input
                                isValid={shortName.isValid}
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
                        <div className="col-12 col-md-6">
                            <div>
                                <select className="form-select" onChange={(e) => setCategoryId(e.target.value)}>
                                    <option value="-1">Please Select Category </option>
                                    {categories.length && categories.map((item, index) => (
                                        <option key={index} value={item._id}>{item.title} </option>
                                    ))

                                    }
                                </select>
                            </div>
                        </div>
                        <div className="col-12 col-md-6">
                            <input type="file" className="form-control" id="cover-course" aria-label="Upload file" onChange={(e) => setCover(e.target.files[0])} />
                        </div>
                        <div className="col-12">
                            <Input
                                isValid={description.isValid}
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
                <div className='d-flex flex-wrap gap-2'>
                    <Button
                        className={`btn ${formState.isFormValid ? "btn-primary" : "btn-secondary"} d-inline-flex align-items-center gap-2`}
                        disabled={!formState.isFormValid || saveArticle.isPending}
                        type="submit"
                        actionForm={(e) => addNewArticle(e)}>
                        <span>Create New Article</span>
                        <i className="fa fa-plus"></i>
                    </Button>
                    <Button
                        className={`btn ${formState.isFormValid ? "btn-primary" : "btn-secondary"} d-inline-flex align-items-center gap-2`}
                        disabled={!formState.isFormValid || saveArticle.isPending}
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
