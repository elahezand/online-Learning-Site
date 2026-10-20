import { useEffect, useState } from 'react'
import DataTable from '../../components/modules/p-admin/DataTable/DataTable'
import Pageination from '../../components/modules/Pageination/Pageination'
import useForm from '../../Hooks/useForm'
import Input from '../../components/modules/Form/Input'
import Button from '../../components/modules/Form/Button'
import { requiredValidator, maxValidator, minValidator }
    from '../../validators/rules'
import { useParams } from 'react-router-dom'
import swal from 'sweetalert'
import { useQueryClient } from '@tanstack/react-query'
import { attempt, discountsApi, queryKeys, useCourses, useDiscounts } from '../../api'

export default function Discounts() {
    const param = useParams()
    const { page } = param

    const pageSize = 10

    const { data: allDiscounts = [] } = useDiscounts()
    const queryClient = useQueryClient()
    const getAllDiscounts = () => queryClient.invalidateQueries({ queryKey: queryKeys.discounts })
    const [currentPage, setCurrentPage] = useState(1)

    const { data: courses = [] } = useCourses()
    const [courseId, setCourseId] = useState("")

    const [formState, changeInputHandeler] = useForm({
        code: {
            value: "",
            isValid: false
        },
        percent: {
            value: "",
            isValid: false
        },
        max: {
            value: "",
            isValid: false
        }
    }, false)

    const { code, percent, max } = formState.inputs

    useEffect(() => {
        setCurrentPage(page)
    }, [page, currentPage])

    const lastChild = currentPage * pageSize
    const firstChild = lastChild - pageSize

    const pageCount = Math.ceil(allDiscounts.length / pageSize)
    const paginatedData = allDiscounts.slice(firstChild, lastChild)

    const removeCode = async (discountId) => {
        swal({
            title: "are you sure to remove this discount?",
            icon: "warning",
            buttons: ["No", "yes"]
        }).then(async result => {
            if (result) {
                const res = await attempt(discountsApi.remove(discountId))
                if (res.ok) {
                    swal({
                        title: "the discount was removed successfully",
                        icon: "success",
                        buttons: "ok"
                    }).then(result => {
                        if (result) {
                            getAllDiscounts()
                        }
                    })
                }
            }
        })
    }

    const addNewDiscount = async () => {
        const res = await attempt(discountsApi.create({ code: code.value, percent: percent.value, max: max.value, course: courseId }))
        if (res.ok) {
            swal({
                title: "the discount was created successfully",
                icon: "success",
                buttons: "ok"
            }).then(result => {
                if (result) {
                    getAllDiscounts()
                }
            })
        }
    }

    return (
        <>
            <section className="card admin-form">
                <div className="admin-form__header">
                    <span className="icon-badge"><i className="fa-solid fa-plus"></i></span>
                    <h2 className="h5 fw-bold mb-0">Add New Discount</h2>
                </div>
                <form className="admin-form__body" onSubmit={(e) => e.preventDefault()}>
                    <div className='row g-3'>
                        <div className="col-12 col-md-6">
                            <div>
                                <Input
                                    isValid={code.isValid}
                                    placeholder="code"
                                    type="input"
                                    onChangeInput={(e) =>
                                        changeInputHandeler(e, "code", [
                                            requiredValidator(),
                                            maxValidator(20),
                                            minValidator(6),
                                        ])} />
                            </div>
                        </div>
                        <div className="col-12 col-md-6">
                            <Input
                                isValid={percent.isValid}
                                placeholder="Percent"
                                type="input"
                                onChangeInput={(e) =>
                                    changeInputHandeler(e, "percent", [
                                        requiredValidator(),
                                        maxValidator(2),

                                    ])} />
                        </div>
                        <div className="col-12 col-md-6">
                            <Input
                                isValid={max.isValid}
                                placeholder="max"
                                type="input"
                                onChangeInput={(e) =>
                                    changeInputHandeler(e, "max", [
                                        requiredValidator(),
                                        maxValidator(4),
                                        minValidator(1),

                                    ])} />
                        </div>
                        <div className="col-12 col-md-6">
                            <div>
                                <select className="form-select"
                                    onChange={(e) => setCourseId(e.target.value)}>
                                    <option value="-1">Please Select Course </option>
                                    {courses.length && courses.map((item, index) => (
                                        <option key={index} value={item._id}>{item.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                </form>
                <Button
                    className={`btn ${formState.isFormValid ? "btn-primary" : "btn-secondary"} d-inline-flex align-items-center gap-2`}
                    disabled={!formState.isFormValid}
                    type="submit"
                    actionForm={(e) => addNewDiscount(e)}>
                    <span>Create New Discount</span>
                    <i className="fa fa-plus"></i>
                </Button>
            </section>
            <DataTable title="Discounts">
                <table className="table table-hover align-middle mb-0">
                    <thead>
                        <tr>
                            <th className='number'>#</th>
                            <th>Code</th>
                            <th>Creator</th>
                            <th>Percent</th>
                            <th>CreatedAt</th>
                            <th>Used</th>
                            <th>Max</th>
                            <th>
                                <i className='fa fa-edit'></i>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedData?.length && paginatedData.map((code, index) => (
                            <tr key={index}>
                                <td className="number">{index + 1}</td>
                                <td> {code.code}</td>
                                <td>{code.creator}</td>
                                <td> {code.percent} %</td>
                                <td> {code.createdAt.slice(0, 10)}</td>
                                <td> {code.uses}</td>
                                <td>{code.max}</td>
                                <td>
                                    <button
                                        onClick={() =>
                                            removeCode(code._id)}
                                        className='btn btn-sm btn-danger'>
                                        Remove</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </DataTable>
            <Pageination
                data={paginatedData}
                pathName={`/p-admin/discounts`}
                pageCount={pageCount}
                currentPage={currentPage} />

        </>
    )
}
