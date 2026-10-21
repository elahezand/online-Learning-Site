import { useEffect } from "react"
import { useParams } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { FaFloppyDisk, FaPenToSquare, FaPlus } from "react-icons/fa6"
import FormCard from "../../components/ui/FormCard"
import { articleDraftSchema } from "../../validators"
import ArticleFields from "../../features/articles/ArticleFields"
import { buildArticleData } from "../../features/articles/articleData"
import { useArticle, usePublishArticle, useSaveDraft } from "../../features/articles/hooks"

const defaultValues = { title: "", shortName: "", categoryID: "", description: "", body: "", cover: "" }

export default function ArticleDraft() {
    const { shortName } = useParams()
    const { data: article } = useArticle(shortName)
    const form = useForm({ resolver: zodResolver(articleDraftSchema), defaultValues, mode: "onTouched" })
    const publishArticle = usePublishArticle()
    const saveDraft = useSaveDraft()
    const isSaving = publishArticle.isPending || saveDraft.isPending
    const { reset } = form

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

    return (
        <FormCard icon={<FaPenToSquare />} title="Edit Draft">
            <form className="d-grid gap-3" onSubmit={form.handleSubmit(data => publishArticle.mutate(buildArticleData(data)))} noValidate>
                <ArticleFields form={form} editorKey={article?._id ?? "loading"} />
                <div className="d-flex flex-wrap gap-2">
                    <button type="submit" className="btn btn-primary d-inline-flex align-items-center gap-2" disabled={isSaving}>
                        <FaPlus /> Publish article
                    </button>
                    <button type="button" className="btn btn-outline-primary d-inline-flex align-items-center gap-2" disabled={isSaving}
                        onClick={form.handleSubmit(data => saveDraft.mutate(buildArticleData(data)))}>
                        <FaFloppyDisk /> Save draft
                    </button>
                </div>
            </form>
        </FormCard>
    )
}
