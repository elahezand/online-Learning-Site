import { useEffect } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { FaArrowLeft, FaFloppyDisk, FaPenToSquare, FaPlus } from "react-icons/fa6"
import FormCard from "../../components/ui/FormCard"
import PageLoader from "../../components/ui/PageLoader"
import { articleDraftSchema } from "../../validators"
import type { ArticleData, ArticleFormValues } from "../../validators"
import ArticleFields from "../../features/articles/ArticleFields"
import { buildArticleData } from "../../features/articles/articleData"
import { useArticle, usePublishArticle, useSaveDraft, useUpdateArticle } from "../../features/articles/hooks"

const defaultValues: ArticleFormValues = { title: "", shortName: "", categoryID: "", description: "", body: "", cover: "" }


export default function EditArticle() {
    const { shortName } = useParams()
    const navigate = useNavigate()
    const { data: article, isLoading } = useArticle(shortName)
    const isDraft = article ? Number(article.publish) !== 1 : false

    const form = useForm<ArticleFormValues, unknown, ArticleData>({ resolver: zodResolver(articleDraftSchema), defaultValues, mode: "onTouched" })
    const backToList = () => navigate("/p-admin/articles")
    const publishArticle = usePublishArticle(backToList)
    const saveDraft = useSaveDraft()
    const updateArticle = useUpdateArticle(article?._id ?? "", backToList)
    const isSaving = publishArticle.isPending || saveDraft.isPending || updateArticle.isPending
    const { reset, formState: { isDirty } } = form

    useEffect(() => {
        if (!article) return
        reset({
            title: article.title ?? "",
            shortName: article.shortName ?? "",
            categoryID: article.categoryID?._id ?? "",
            description: article.description ?? "",
            body: article.body ?? "",
            cover: "",
        })
    }, [article, reset])

    if (isLoading) return <PageLoader />

    const submit = form.handleSubmit(data => (isDraft ? publishArticle : updateArticle).mutate(buildArticleData(data)))

    return (
        <>
            <Link to="/p-admin/articles" className="btn btn-sm btn-outline-secondary d-inline-flex align-items-center gap-2 mb-3">
                <FaArrowLeft /> Back to articles
            </Link>
            {article ?
                <FormCard icon={<FaPenToSquare />} title={isDraft ? `Edit draft “${article.title}”` : `Edit “${article.title}”`}>
                    <form className="d-grid gap-3" onSubmit={submit} noValidate>
                        <ArticleFields form={form} editorKey={article._id} currentCover={article.cover} />
                        <div className="d-flex flex-wrap gap-2">
                            {isDraft ? <>
                                <button type="submit" className="btn btn-primary d-inline-flex align-items-center gap-2" disabled={isSaving}>
                                    <FaPlus /> Publish article
                                </button>
                                <button type="button" className="btn btn-outline-primary d-inline-flex align-items-center gap-2" disabled={isSaving}
                                    onClick={form.handleSubmit(data => saveDraft.mutate(buildArticleData(data)))}>
                                    <FaFloppyDisk /> Save draft
                                </button>
                            </> :
                                <button type="submit" className="btn btn-primary d-inline-flex align-items-center gap-2" disabled={isSaving || !isDirty}>
                                    <FaFloppyDisk /> Save changes
                                </button>}
                            <Link to="/p-admin/articles" className="btn btn-outline-secondary">Cancel</Link>
                        </div>
                    </form>
                </FormCard> :
                <div className="alert alert-warning">This article doesn't exist or was removed.</div>}
        </>
    )
}
