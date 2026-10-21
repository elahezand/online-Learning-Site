import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { FaLayerGroup, FaPen, FaPlus, FaTrash } from "react-icons/fa6"
import DataTable from "../../components/ui/DataTable"
import Pagination from "../../components/ui/Pagination"
import usePagination from "../../hooks/usePagination"
import Input from "../../components/ui/Input"
import FormCard from "../../components/ui/FormCard"
import ActionButton, { EmptyRow, RowActions } from "../../components/ui/ActionButton"
import { confirmToast, promptToast } from "../../components/ui/toastActions"
import { categorySchema, categoryTitleSchema } from "../../validators"
import { useCategories, useCreateCategory, useDeleteCategory, useUpdateCategory } from "../../features/categories/hooks"

export default function Categories() {
        const { data: categories = [] } = useCategories()
    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        resolver: zodResolver(categorySchema),
        defaultValues: { title: "", name: "" },
        mode: "onTouched",
    })
    const createCategory = useCreateCategory(() => reset())
    const deleteCategory = useDeleteCategory()
    const updateCategory = useUpdateCategory()


    const { page, pageCount, start, pageItems: paginatedData } = usePagination(categories)

    const removeCategory = async (category) => {
        const ok = await confirmToast({ title: `Remove "${category.title}"?`, description: "This category will be deleted.", confirmLabel: "Remove" })
        if (ok) deleteCategory.mutate(category._id)
    }

    const editCategory = async (category) => {
        const title = await promptToast({ title: "New title", description: `Current: ${category.title}`, placeholder: "Category title", confirmLabel: "Save", schema: categoryTitleSchema, multiline: false })
        if (title) updateCategory.mutate({ id: category._id, title, name: category.name })
    }

    return (
        <>
            <FormCard icon={<FaPlus />} title="Add New Category">
                <form className="d-grid gap-3" onSubmit={handleSubmit(data => createCategory.mutate(data))} noValidate>
                    <div className="row g-3">
                        <div className="col-12 col-md-6">
                            <div className="input-group has-validation">
                                <span className="input-group-text"><FaLayerGroup /></span>
                                <Input placeholder="Title" aria-label="Title" {...register("title")} error={errors.title?.message} />
                            </div>
                        </div>
                        <div className="col-12 col-md-6">
                            <div className="input-group has-validation">
                                <span className="input-group-text">/</span>
                                <Input placeholder="Short name, e.g. frontend" aria-label="Short name" {...register("name")} error={errors.name?.message} />
                            </div>
                        </div>
                    </div>
                    <div>
                        <button type="submit" className="btn btn-primary d-inline-flex align-items-center gap-2" disabled={createCategory.isPending}>
                            <FaPlus /> Create
                        </button>
                    </div>
                </form>
            </FormCard>

            <DataTable title="Categories">
                <table className="table table-hover align-middle text-nowrap mb-0">
                    <thead>
                        <tr>
                            <th className="text-body-secondary">#</th>
                            <th>Title</th>
                            <th>Short name</th>
                            <th className="text-end">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedData.length ? paginatedData.map((item, index) => (
                            <tr key={item._id}>
                                <td className="text-body-secondary">{start + index + 1}</td>
                                <td className="fw-medium text-body-emphasis">{item.title}</td>
                                <td>{item.name}</td>
                                <td>
                                    <RowActions>
                                        <ActionButton icon={<FaPen />} onClick={() => editCategory(item)}>Edit</ActionButton>
                                        <ActionButton variant="danger" icon={<FaTrash />} onClick={() => removeCategory(item)}>Remove</ActionButton>
                                    </RowActions>
                                </td>
                            </tr>
                        )) : <EmptyRow colSpan={4}>No categories yet.</EmptyRow>}
                    </tbody>
                </table>
            </DataTable>
            <Pagination page={page} pageCount={pageCount} />
        </>
    )
}
