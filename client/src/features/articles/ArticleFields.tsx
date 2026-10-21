import { Controller } from "react-hook-form"
import type { UseFormReturn } from "react-hook-form"
import type { ArticleData, ArticleFormValues } from "../../validators"
import Input from "../../components/ui/Input"
import Editor from "../../components/ui/Editor"
import { useCategories } from "../categories/hooks"

interface ArticleFieldsProps {
    form: UseFormReturn<ArticleFormValues, unknown, ArticleData>
    editorKey: string | number
}

export default function ArticleFields({ form, editorKey }: ArticleFieldsProps) {
    const { register, control, formState: { errors } } = form
    const { data: categories = [] } = useCategories()

    return (
        <div className="row g-3">
            <div className="col-12 col-md-6">
                <Input placeholder="Title" aria-label="Title" {...register("title")} error={errors.title?.message} />
            </div>
            <div className="col-12 col-md-6">
                <Input placeholder="Article link, e.g. react-hooks-guide" aria-label="Article link" {...register("shortName")} error={errors.shortName?.message} />
            </div>
            <div className="col-12 col-md-6">
                <Input as="select" aria-label="Category" {...register("categoryID")} error={errors.categoryID?.message}>
                    <option value="">Select a category</option>
                    {categories.map(item => <option key={item._id} value={item._id}>{item.title}</option>)}
                </Input>
            </div>
            <div className="col-12 col-md-6">
                <Input type="file" accept="image/*" aria-label="Cover image" {...register("cover")} error={errors.cover?.message} />
            </div>
            <div className="col-12">
                <Input as="textarea" rows={4} placeholder="Short description" aria-label="Short description" {...register("description")} error={errors.description?.message} />
            </div>
            <div className="col-12">
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
