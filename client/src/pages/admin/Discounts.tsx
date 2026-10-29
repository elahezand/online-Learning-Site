import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { FaHashtag, FaPercent, FaPlus, FaTicketSimple, FaTrash } from "react-icons/fa6"
import DataTable from "../../components/ui/DataTable"
import Pagination from "../../components/ui/Pagination"
import Input from "../../components/ui/Input"
import FormCard from "../../components/ui/FormCard"
import ActionButton, { EmptyRow, RowActions } from "../../components/ui/ActionButton"
import { confirmToast } from "../../components/ui/toastActions"
import useListParams from "../../hooks/useListParams"
import { discountSchema } from "../../validators"
import { useCourseOptions } from "../../features/courses/hooks"
import { useCreateDiscount, useDeleteDiscount, useDiscounts } from "../../features/discounts/hooks"
import type { Discount } from "../../types/models"

const PAGE_SIZE = 10

export default function Discounts() {
    const { page } = useListParams()
    const { data, isLoading } = useDiscounts({ page, limit: PAGE_SIZE })
    const discounts = data?.items ?? []
    const { data: courses = [] } = useCourseOptions()

    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        resolver: zodResolver(discountSchema),
        defaultValues: { code: "", percent: "", max: "", course: "" },
        mode: "onTouched",
    })
    const createDiscount = useCreateDiscount(() => reset())
    const deleteDiscount = useDeleteDiscount()

    const removeCode = async (discount: Discount) => {
        const ok = await confirmToast({ title: `Remove code "${discount.code}"?`, description: "Users will no longer be able to use it.", confirmLabel: "Remove" })
        if (ok) deleteDiscount.mutate(discount._id)
    }

    return (
        <>
            <FormCard icon={<FaPlus />} title="Add New Discount">
                <form className="d-grid gap-3" onSubmit={handleSubmit(data => createDiscount.mutate(data))} noValidate>
                    <div className="row g-3">
                        <div className="col-12 col-md-6">
                            <div className="input-group has-validation">
                                <span className="input-group-text"><FaTicketSimple /></span>
                                <Input placeholder="Code" aria-label="Code" {...register("code")} error={errors.code?.message} />
                            </div>
                        </div>
                        <div className="col-12 col-md-6">
                            <div className="input-group has-validation">
                                <span className="input-group-text"><FaPercent /></span>
                                <Input type="number" min="1" max="100" placeholder="Percent" aria-label="Percent" {...register("percent")} error={errors.percent?.message} />
                            </div>
                        </div>
                        <div className="col-12 col-md-6">
                            <div className="input-group has-validation">
                                <span className="input-group-text"><FaHashtag /></span>
                                <Input type="number" min="1" placeholder="Max uses" aria-label="Max uses" {...register("max")} error={errors.max?.message} />
                            </div>
                        </div>
                        <div className="col-12 col-md-6">
                            <Input as="select" aria-label="Course" {...register("course")} error={errors.course?.message}>
                                <option value="">Select a course</option>
                                {courses.map(item => <option key={item._id} value={item._id}>{item.name}</option>)}
                            </Input>
                        </div>
                    </div>
                    <div>
                        <button type="submit" className="btn btn-primary d-inline-flex align-items-center gap-2" disabled={createDiscount.isPending}>
                            <FaPlus /> Create discount
                        </button>
                    </div>
                </form>
            </FormCard>

            <DataTable title="Discounts">
                <table className="table table-hover align-middle text-nowrap mb-0">
                    <thead>
                        <tr>
                            <th className="text-body-secondary">#</th>
                            <th>Code</th>
                            <th>Creator</th>
                            <th>Percent</th>
                            <th>Created</th>
                            <th>Used</th>
                            <th>Max</th>
                            <th className="text-end">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {discounts.length ? discounts.map((item, index) => (
                            <tr key={item._id}>
                                <td className="text-body-secondary">{index + 1}</td>
                                <td><span className="badge bg-primary-subtle text-primary-emphasis font-monospace">{item.code}</span></td>
                                <td>{item.creator}</td>
                                <td>{item.percent}%</td>
                                <td>{item.createdAt?.slice(0, 10)}</td>
                                <td>{item.uses}</td>
                                <td>{item.max}</td>
                                <td>
                                    <RowActions>
                                        <ActionButton variant="danger" icon={<FaTrash />} onClick={() => removeCode(item)}>Remove</ActionButton>
                                    </RowActions>
                                </td>
                            </tr>
                        )) : <EmptyRow colSpan={8}>{isLoading ? "Loading…" : "No discount codes yet."}</EmptyRow>}
                    </tbody>
                </table>
            </DataTable>
            <Pagination pagination={data?.pagination} />
        </>
    )
}