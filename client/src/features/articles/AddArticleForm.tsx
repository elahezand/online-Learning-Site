import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { FaFloppyDisk, FaPlus } from "react-icons/fa6"
import FormCard from "../../components/ui/FormCard"
import { articleSchema } from "../../validators"
import type { ArticleFormValues } from "../../validators"
import ArticleFields from "./ArticleFields"
import { buildArticleData } from "./articleData"
import { usePublishArticle, useSaveDraft } from "./hooks"

const defaultValues: ArticleFormValues = { title: "", shortName: "", categoryID: "", description: "", body: "", cover: "" }

export default function AddArticleForm() {
    const [editorKey, setEditorKey] = useState(0)
    const form = useForm({ resolver: zodResolver(articleSchema), defaultValues, mode: "onTouched" })
    const clear = () => {
        form.reset()
        setEditorKey(key => key + 1)
    }
    const publishArticle = usePublishArticle(clear)
    const saveDraft = useSaveDraft(clear)
    const isSaving = publishArticle.isPending || saveDraft.isPending

    return (
        <FormCard icon={<FaPlus />} title="Add New Article">
            <form className="d-grid gap-3" onSubmit={form.handleSubmit(data => publishArticle.mutate(buildArticleData(data)))} noValidate>
                <ArticleFields form={form} editorKey={editorKey} />
                <div className="d-flex flex-wrap gap-2">
                    <button type="submit" className="btn btn-primary d-inline-flex align-items-center gap-2" disabled={isSaving}>
                        <FaPlus /> Publish article
                    </button>
                    <button type="button" className="btn btn-outline-primary d-inline-flex align-items-center gap-2" disabled={isSaving}
                        onClick={form.handleSubmit(data => saveDraft.mutate(buildArticleData(data)))}>
                        <FaFloppyDisk /> Save as draft
                    </button>
                </div>
            </form>
        </FormCard>
    )
}
