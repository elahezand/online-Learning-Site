import { useEffect, useState } from 'react'
import DataTable from '../../components/modules/p-admin/DataTable/DataTable'
import Pageination from '../../components/modules/Pageination/Pageination'
import useForm from '../../Hooks/useForm'
import Input from '../../components/modules/Form/Input'
import Button from '../../components/modules/Form/Button'
import { requiredValidator, maxValidator, minValidator }
    from '../../validators/rules'
import { useParams } from 'react-router-dom'
import getMe from '../../utils/auth'
import swal from 'sweetalert'

export default function Discounts() {
    const param = useParams()
    const { page } = param

    const pageSize = 10

    const [allDiscounts, setAllDiscounts] = useState([])
    const [currentPage, setCurrentPage] = useState(1)

    const [courses, setCourses] = useState([])
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

    const getAllDiscounts = () => {
        const getFromLocalStorage = JSON.parse(localStorage.getItem("userData"))

        fetch("http://localhost:4000/v1/offs", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${getFromLocalStorage.token}`,
            }
        })
            .then(res => res.json())
            .then(data => {
                setAllDiscounts(data)
            })
    }

    useEffect(() => {
        getAllDiscounts()
        fetch("http://localhost:4000/v1/courses")
            .then(res => res.json())
            .then(data => {
                setCourses(data)
            })
    }, [])

    useEffect(() => {
        setCurrentPage(page)
    }, [page, currentPage])

    const lastChild = currentPage * pageSize
    const firstChild = lastChild - pageSize

    const pageCount = Math.ceil(allDiscounts.length / pageSize)
    const paginatedData = allDiscounts.slice(firstChild, lastChild)

    const removeCode = async (discountId) => {
        const token = await getMe()
        swal({
            title: "are you sure to remove this discount?",
            icon: "warning",
            buttons: ["No", "yes"]
        }).then(async result => {
            if (result) {
                const res = await fetch(`http://localhost:4000/v1/offs/${discountId}`, {
                    method: "DELETE",
                    headers: {
                        "Authorization": `Bearer ${token}`,

                    }
                })
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
        const token = await getMe()
        const res = await fetch("http://localhost:4000/v1/offs", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                code: code.value,
                percent: percent.value,
                max: max.value,
                course: courseId
            })
        })
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
            <div className="form-container">
                <div className='form-header'>
                    <i className="fa-solid fa-plus"></i>
                    <h1>Add New Discount</h1>
                </div>
                <form className="form">
                    <div className='row'>
                        <div className="col-6">
                            <div className="register-form__username">
                                <Input
                                    isValid={code.isValid}
                                    className="register-form__username-input"
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
                        <div className="col-6">
                            <Input
                                isValid={percent.isValid}
                                className="register-form__username-input"
                                placeholder="Percent"
                                type="input"
                                onChangeInput={(e) =>
                                    changeInputHandeler(e, "percent", [
                                        requiredValidator(),
                                        maxValidator(2),

                                    ])} />
                        </div>
                        <div className="col-6">
                            <Input
                                isValid={max.isValid}
                                className="register-form__username-input"
                                placeholder="max"
                                type="input"
                                onChangeInput={(e) =>
                                    changeInputHandeler(e, "max", [
                                        requiredValidator(),
                                        maxValidator(4),
                                        minValidator(1),

                                    ])} />
                        </div>
                        <div className="col-6">
                            <div className="categories">
                                <select
                                    className="category-list"
                                    onChange={(e) => setCourseId(e.target.value)}>
                                    <option value="-1">Please Select Course </option>
                                    {courses.length && courses.map((item, index) => (
                                        <option key={index} value={item._id}>{item.name}</option>
                                    ))}
                                </select>
                                <span className="error-message text-danger"></span>
                            </div>
                        </div>
                    </div>
                </form>
                <Button
                    className={`form__btn ${formState.isFormValid ? "active" : null}`}
                    disabled={!formState.isFormValid}
                    type="submit"
                    actionForm={(e) => addNewDiscount(e)}>
                    <span className="form__btn-text">Create New Discount</span>
                    <i className="fa fa-plus form__btn-icon"></i>
                </Button>
            </div>
            <DataTable title="Discounts">
                <table style={{ width: "100%" }}>
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
                                        className='remove-user'>
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
