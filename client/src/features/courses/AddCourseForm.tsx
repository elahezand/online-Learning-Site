import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { FaPlus } from "react-icons/fa6"
import Input from "../../components/ui/Input"
import FormCard from "../../components/ui/FormCard"
import { courseSchema } from "../../validators"
import type { CourseFormValues } from "../../validators"
import type { CourseData } from "../../validators"
import { useCategories } from "../categories/hooks"
import { useCreateCourse } from "./hooks"

const defaultValues: CourseFormValues = { name: "", shortName: "", price: "", support: "", categoryID: "", status: "start", description: "", cover: "" }

const STATUSES = [["start", "Start"], ["presell", "Presell"]]

export default function AddCourseForm() {
    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        resolver: zodResolver(courseSchema),
        defaultValues,
        mode: "onTouched",
    })
    const { data: categories = [] } = useCategories()
    const createCourse = useCreateCourse(() => reset())

    const onSubmit = (data: CourseData) => {
        const formData = new FormData()
        Object.entries(data).forEach(([key, value]) => formData.append(key, value instanceof File ? value : String(value)))
        createCourse.mutate(formData)
    }

    return (
        <FormCard icon={<FaPlus />} title="Add New Course">
            <form className="d-grid gap-3" onSubmit={handleSubmit(onSubmit)} noValidate>
                <div className="row g-3">
                    <div className="col-12 col-md-6">
                        <Input placeholder="Name" aria-label="Name" {...register("name")} error={errors.name?.message} />
                    </div>
                    <div className="col-12 col-md-6">
                        <Input placeholder="Course link, e.g. react-basics" aria-label="Course link" {...register("shortName")} error={errors.shortName?.message} />
                    </div>
                    <div className="col-12 col-md-6">
                        <Input type="number" min="0" placeholder="Price (0 = free)" aria-label="Price" {...register("price")} error={errors.price?.message} />
                    </div>
                    <div className="col-12 col-md-6">
                        <Input as="select" aria-label="Category" {...register("categoryID")} error={errors.categoryID?.message}>
                            <option value="">Select a category</option>
                            {categories.map(item => <option key={item._id} value={item._id}>{item.title}</option>)}
                        </Input>
                    </div>
                    <div className="col-12 col-md-6">
                        <Input placeholder="Support" aria-label="Support" {...register("support")} error={errors.support?.message} />
                    </div>
                    <div className="col-12 col-md-6">
                        <Input type="file" accept="image/*" aria-label="Cover image" {...register("cover")} error={errors.cover?.message} />
                    </div>
                    <div className="col-12 col-md-6">
                        <fieldset className="d-flex flex-wrap align-items-center gap-3 h-100">
                            <legend className="form-label fs-6 mb-0 w-auto float-none">Status:</legend>
                            {STATUSES.map(([value, label]) => (
                                <div className="form-check form-check-inline" key={value}>
                                    <input className="form-check-input" type="radio" id={`course-status-${value}`} value={value} {...register("status")} />
                                    <label className="form-check-label" htmlFor={`course-status-${value}`}>{label}</label>
                                </div>
                            ))}
                            {errors.status && <div className="text-danger small w-100">{errors.status.message}</div>}
                        </fieldset>
                    </div>
                    <div className="col-12">
                        <Input as="textarea" rows={5} placeholder="Description" aria-label="Description" {...register("description")} error={errors.description?.message} />
                    </div>
                </div>
                <div>
                    <button type="submit" className="btn btn-primary d-inline-flex align-items-center gap-2" disabled={createCourse.isPending}>
                        <FaPlus /> Create course
                    </button>
                </div>
            </form>
        </FormCard>
    )
}
