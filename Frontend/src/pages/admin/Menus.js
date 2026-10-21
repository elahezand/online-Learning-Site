import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { FaBars, FaLink, FaPlus, FaTrash } from "react-icons/fa6"
import DataTable from "../../components/ui/DataTable"
import Pagination from "../../components/ui/Pagination"
import usePagination from "../../hooks/usePagination"
import Input from "../../components/ui/Input"
import FormCard from "../../components/ui/FormCard"
import ActionButton, { EmptyRow, RowActions } from "../../components/ui/ActionButton"
import { confirmToast } from "../../components/ui/toastActions"
import { menuSchema } from "../../validators"
import { useCreateMenu, useDeleteMenu, useMenus } from "../../features/menus/hooks"

export default function Menus() {
        const { data: menus = [] } = useMenus()
    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        resolver: zodResolver(menuSchema),
        defaultValues: { title: "", href: "", parent: "" },
        mode: "onTouched",
    })
    const createMenu = useCreateMenu(() => reset())
    const deleteMenu = useDeleteMenu()


    const { page, pageCount, start, pageItems: paginatedData } = usePagination(menus)

    const addMenu = ({ title, href, parent }) => createMenu.mutate({ title, href, parent: parent || undefined })

    const removeMenu = async (menu) => {
        const ok = await confirmToast({ title: `Remove "${menu.title}"?`, description: "The menu item will be deleted.", confirmLabel: "Remove" })
        if (ok) deleteMenu.mutate(menu._id)
    }

    return (
        <>
            <FormCard icon={<FaPlus />} title="Add New Menu">
                <form className="d-grid gap-3" onSubmit={handleSubmit(addMenu)} noValidate>
                    <div className="row g-3">
                        <div className="col-12 col-md-6">
                            <div className="input-group has-validation">
                                <span className="input-group-text"><FaBars /></span>
                                <Input placeholder="Title" aria-label="Title" {...register("title")} error={errors.title?.message} />
                            </div>
                        </div>
                        <div className="col-12 col-md-6">
                            <div className="input-group has-validation">
                                <span className="input-group-text"><FaLink /></span>
                                <Input placeholder="Link, e.g. /courses" aria-label="Link" {...register("href")} error={errors.href?.message} />
                            </div>
                        </div>
                        <div className="col-12 col-md-6">
                            <Input as="select" aria-label="Parent menu" {...register("parent")} error={errors.parent?.message}>
                                <option value="">No parent (top level)</option>
                                {menus.filter(item => !item.parent).map(menu => <option key={menu._id} value={menu._id}>{menu.title}</option>)}
                            </Input>
                        </div>
                    </div>
                    <div>
                        <button type="submit" className="btn btn-primary d-inline-flex align-items-center gap-2" disabled={createMenu.isPending}>
                            <FaPlus /> Create
                        </button>
                    </div>
                </form>
            </FormCard>

            <DataTable title="Menus">
                <table className="table table-hover align-middle text-nowrap mb-0">
                    <thead>
                        <tr>
                            <th className="text-body-secondary">#</th>
                            <th>Title</th>
                            <th>Link</th>
                            <th>Parent</th>
                            <th className="text-end">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedData.length ? paginatedData.map((item, index) => (
                            <tr key={item._id}>
                                <td className="text-body-secondary">{start + index + 1}</td>
                                <td className="fw-medium text-body-emphasis">{item.title}</td>
                                <td>{item.href}</td>
                                <td>{item.parent ? item.parent.title :
                                    <span className="badge rounded-pill bg-primary-subtle text-primary-emphasis">Top level</span>}</td>
                                <td>
                                    <RowActions>
                                        <ActionButton variant="danger" icon={<FaTrash />} onClick={() => removeMenu(item)}>Remove</ActionButton>
                                    </RowActions>
                                </td>
                            </tr>
                        )) : <EmptyRow colSpan={5}>No menus yet.</EmptyRow>}
                    </tbody>
                </table>
            </DataTable>
            <Pagination page={page} pageCount={pageCount} />
        </>
    )
}
