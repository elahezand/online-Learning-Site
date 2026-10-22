import { Controller, useWatch } from "react-hook-form"
import type { UseFormReturn } from "react-hook-form"
import type { ArticleData, ArticleFormValues } from "../../validators"
import Input from "../../components/ui/Input"
import Editor from "../../components/ui/Editor"
import CoverPreview from "../../components/ui/CoverPreview"
import { useCategories } from "../categories/hooks"

interface ArticleFieldsProps {
    form: UseFormReturn<ArticleFormValues, unknown, ArticleData>
    editorKey: string | number
    currentCover?: string
}

export default function ArticleFields({ form, editorKey, currentCover }: ArticleFieldsProps) {
    const { register, control, formState: { errors } } = form
    const cover = useWatch({ control, name: "cover" })
    const { data: categories = [] } = useCategories()

    return (
        <div className="row g-3">
            <div className="col-12 col-lg-7 d-grid gap-3 align-content-start">
                <div>
                    <label className="form-label small fw-medium" htmlFor="article-title">Title</label>
                    <Input id="article-title" placeholder="e.g. A practical guide to React hooks" {...register("title")} error={errors.title?.message} />
                </div>
                <div className="row g-3">
                    <div className="col-12 col-md-6">
                        <label className="form-label small fw-medium" htmlFor="article-link">Article link</label>
                        <Input id="article-link" placeholder="e.g. react-hooks-guide" {...register("shortName")} error={errors.shortName?.message} />
                    </div>
                    <div className="col-12 col-md-6">
                        <label className="form-label small fw-medium" htmlFor="article-category">Category</label>
                        <Input id="article-category" as="select" {...register("categoryID")} error={errors.categoryID?.message}>
                            <option value="">Select a category</option>
                            {categories.map(item => <option key={item._id} value={item._id}>{item.title}</option>)}
                        </Input>
                    </div>
                </div>
                <div>
                    <label className="form-label small fw-medium" htmlFor="article-description">Short description</label>
                    <Input id="article-description" as="textarea" rows={4} placeholder="Shown on the article card" {...register("description")} error={errors.description?.message} />
                </div>
            </div>
            <div className="col-12 col-lg-5">
                <label className="form-label small fw-medium" htmlFor="article-cover">
                    Cover {currentCover && <span className="text-body-secondary fw-normal">(leave empty to keep the current one)</span>}
                </label>
                <Input id="article-cover" type="file" accept="image/*" {...register("cover")} error={errors.cover?.message} />
                <div className="mt-2"><CoverPreview file={cover} current={currentCover} /></div>
            </div>
            <div className="col-12">
                <div className="form-label small fw-medium">Content</div>
                <Controller
                    name="body"
                    control={control}
                    render={({ field, fieldState }) => (
                        <>
                            <Editor key={editorKey} value={field.value} setContent={field.onChange} />
                            {fieldState.error && <div className="text-danger small mt-1">{fieldState.error.message}</div>}
                        </>
                    )} />
            </div>
        </div>
    )
}
