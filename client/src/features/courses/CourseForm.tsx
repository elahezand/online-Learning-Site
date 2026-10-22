import { useEffect } from "react"
import { useForm, useWatch } from "react-hook-form"
import type { Resolver } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Link } from "react-router-dom"
import { FaFloppyDisk, FaPenToSquare, FaPlus } from "react-icons/fa6"
import Input from "../../components/ui/Input"
import FormCard from "../../components/ui/FormCard"
import { courseEditSchema, courseSchema } from "../../validators"
import type { CourseEditData, CourseFormValues } from "../../validators"
import CoverPreview from "../../components/ui/CoverPreview"
import { useCategories } from "../categories/hooks"
import { categoryIdOf } from "./CourseView"
import { useCreateCourse, useUpdateCourse } from "./hooks"
import type { Course } from "../../types/models"

const STATUSES = [["start", "Start"], ["presell", "Presell"]] as const
const STATES = [["0", "In progress"], ["1", "Completed"]] as const

const emptyValues: CourseFormValues = {
    name: "", shortName: "", price: "", support: "", categoryID: "", status: "start", description: "", cover: "", isComplete: "0",
}

const valuesOf = (course: Course): CourseFormValues => ({
    name: course.name,
    shortName: course.shortName,
    price: String(course.price ?? 0),
    support: course.support ?? "",
    categoryID: categoryIdOf(course) ?? "",
    status: course.status ?? "start",
    description: course.description ?? "",
    cover: "",
    isComplete: Number(course.isComplete) === 1 ? "1" : "0",
})

interface CourseFormProps {
    /** Pass a course to edit it; leave empty to create a new one */
    course?: Course
    /** Called after a successful save */
    onSaved?: () => void
}

export default function CourseForm({ course, onSaved }: CourseFormProps) {
    const isEdit = Boolean(course)
    // Both schemas take the same fields; only the cover is optional when editing
    const resolver = zodResolver(isEdit ? courseEditSchema : courseSchema) as Resolver<CourseFormValues, unknown, CourseEditData>

    const { register, handleSubmit, reset, control, formState: { errors, isDirty } } = useForm<CourseFormValues, unknown, CourseEditData>({
        resolver,
        defaultValues: course ? valuesOf(course) : emptyValues,
        mode: "onTouched",
    })
    const cover = useWatch({ control, name: "cover" })
    const { data: categories = [] } = useCategories()

    const createCourse = useCreateCourse(() => { reset(emptyValues); onSaved?.() })
    const updateCourse = useUpdateCourse(course?._id ?? "", onSaved)
    const saving = createCourse.isPending || updateCourse.isPending

    // Load the course again if it changes (e.g. after it was fetched)
    useEffect(() => { if (course) reset(valuesOf(course)) }, [course, reset])

    const onSubmit = (data: CourseEditData) => {
        const formData = new FormData()
        Object.entries(data).forEach(([key, value]) => {
            if (key === "cover") {
                if (value instanceof File) formData.append(key, value)
                return
            }
            if (key === "isComplete" && !isEdit) return
            formData.append(key, String(value))
        })
        if (isEdit) updateCourse.mutate(formData)
        else createCourse.mutate(formData)
    }

    return (
        <FormCard icon={isEdit ? <FaPenToSquare /> : <FaPlus />} title={isEdit ? `Edit “${course?.name}”` : "Add New Course"}>
            <form className="d-grid gap-3" onSubmit={handleSubmit(onSubmit)} noValidate>
                <div className="row g-3">
                    <div className="col-12 col-md-6">
                        <label className="form-label small fw-medium" htmlFor="course-name">Name</label>
                        <Input id="course-name" placeholder="e.g. React from Zero to Pro" {...register("name")} error={errors.name?.message} />
                    </div>
                    <div className="col-12 col-md-6">
                        <label className="form-label small fw-medium" htmlFor="course-link">Course link</label>
                        <Input id="course-link" placeholder="e.g. react-basics" {...register("shortName")} error={errors.shortName?.message} />
                    </div>
                    <div className="col-12 col-md-6">
                        <label className="form-label small fw-medium" htmlFor="course-price">Price</label>
                        <Input id="course-price" type="number" min="0" placeholder="0 = free" {...register("price")} error={errors.price?.message} />
                    </div>
                    <div className="col-12 col-md-6">
                        <label className="form-label small fw-medium" htmlFor="course-category">Category</label>
                        <Input id="course-category" as="select" {...register("categoryID")} error={errors.categoryID?.message}>
                            <option value="">Select a category</option>
                            {categories.map(item => <option key={item._id} value={item._id}>{item.title}</option>)}
                        </Input>
                    </div>
                    <div className="col-12 col-md-6">
                        <label className="form-label small fw-medium" htmlFor="course-support">Support</label>
                        <Input id="course-support" placeholder="e.g. Telegram" {...register("support")} error={errors.support?.message} />
                    </div>
                    <div className="col-12 col-md-6 d-flex flex-wrap gap-4">
                        <fieldset>
                            <legend className="form-label small fw-medium mb-2">Status</legend>
                            {STATUSES.map(([value, label]) => (
                                <div className="form-check form-check-inline" key={value}>
                                    <input className="form-check-input" type="radio" id={`course-status-${value}`} value={value} {...register("status")} />
                                    <label className="form-check-label" htmlFor={`course-status-${value}`}>{label}</label>
                                </div>
                            ))}
                            {errors.status && <div className="text-danger small">{errors.status.message}</div>}
                        </fieldset>
                        {isEdit &&
                            <fieldset>
                                <legend className="form-label small fw-medium mb-2">Recording</legend>
                                {STATES.map(([value, label]) => (
                                    <div className="form-check form-check-inline" key={value}>
                                        <input className="form-check-input" type="radio" id={`course-state-${value}`} value={value} {...register("isComplete")} />
                                        <label className="form-check-label" htmlFor={`course-state-${value}`}>{label}</label>
                                    </div>
                                ))}
                            </fieldset>}
                    </div>
                    <div className="col-12 col-lg-7">
                        <label className="form-label small fw-medium" htmlFor="course-description">Description</label>
                        <Input id="course-description" as="textarea" rows={8} placeholder="What will students learn?" {...register("description")} error={errors.description?.message} />
                    </div>
                    <div className="col-12 col-lg-5">
                        <label className="form-label small fw-medium" htmlFor="course-cover">
                            Cover {isEdit && <span className="text-body-secondary fw-normal">(leave empty to keep the current one)</span>}
                        </label>
                        <Input id="course-cover" type="file" accept="image/*" {...register("cover")} error={errors.cover?.message} />
                        <div className="mt-2"><CoverPreview file={cover} current={course?.cover} /></div>
                    </div>
                </div>
                <div className="d-flex flex-wrap gap-2">
                    <button type="submit" className="btn btn-primary d-inline-flex align-items-center gap-2" disabled={saving || (isEdit && !isDirty)}>
                        {isEdit ? <><FaFloppyDisk /> Save changes</> : <><FaPlus /> Create course</>}
                    </button>
                    {isEdit && <Link to="/p-admin/courses" className="btn btn-outline-secondary">Cancel</Link>}
                </div>
            </form>
        </FormCard>
    )
}
