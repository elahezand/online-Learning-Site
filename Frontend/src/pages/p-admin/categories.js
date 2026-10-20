import { useState, useEffect } from 'react'
import DataTable from '../../components/modules/p-admin/DataTable/DataTable'
import { useParams } from 'react-router-dom'
import Pageination from '../../components/modules/Pageination/Pageination'
import Input from '../../components/modules/Form/Input'
import Button from '../../components/modules/Form/Button'
import useForm from '../../Hooks/useForm'
import { requiredValidator, minValidator, maxValidator } from '../../validators/rules'
import swal from 'sweetalert'
import { useQueryClient } from '@tanstack/react-query'
import { attempt, categoriesApi, queryKeys, useCategories } from '../../api'

export default function Categories() {
    const param = useParams()
    const { page } = param

    const pageSize = 10

    const { data: categories = [] } = useCategories()
    const queryClient = useQueryClient()
    const getCategories = () => queryClient.invalidateQueries({ queryKey: queryKeys.categories })
    const [currentPage, setCurrentPage] = useState(1)


    const [formState, changeInputHandeler] = useForm(
        {
            shortName:
            {
                value: "",
                isValid: false
            },
            title:
            {
                value: "",
                isValid: false
            },

        },
        false)

    let { shortName, title } = formState.inputs



    useEffect(() => {
        setCurrentPage(page)
    }, [page, currentPage])

    const lastChild = currentPage * pageSize
    const firstChild = lastChild - pageSize

    const pageCount = Math.ceil(categories.length / pageSize)
    const paginatedData = categories.slice(firstChild, lastChild)

    const addNewCategory = async () => {
        const res = await attempt(categoriesApi.create({ name: shortName.value, title: title.value }))

        if (res.ok) {
            swal({
                title: "this category was added successfuly",
                icon: "success",
                buttons: "ok"
            }).then(result => {
                if (result) {
                    getCategories()
                }
            })
        }
    
    }

    const removeCategory = async (Id) => {
        swal({
            title: "are you sure to remove this category",
            icon: "warning",
            buttons: ["No", "yes"]
        }).then(async result => {
            if (result) {
                const res = await attempt(categoriesApi.remove(Id))
                if (res.ok) {
                    swal({
                        title: "this category was removed successfuly",
                        icon: "success",
                        buttons: "ok"
                    }).then(result => {
                        if (result) {
                            getCategories()
                        }
                    })
                }
            }
        })
    

    }

    const editCategory = async (categoryID, shortName) => {
        swal({
            title: "plaese send new title",
            content: "input",
            buttons: "Create New Title"
        })
            .then(async result => {
                if (result?.trim().length) {
                    const res = await attempt(categoriesApi.update(categoryID, { title: result, name: shortName }))
                    if (res.ok) {
                        console.log(res);

                        swal({
                            title: "this category was updated successfuly",
                            icon: "success",
                            buttons: "ok"
                        }).then(result => {
                            if (result) {
                                getCategories()
                            }
                        })
                    }
                }
                else {
                    swal({
                        title: "Please inter new Title",
                        icon: "warning",
                        buttons: "ok"
                    })
                }
            })
    
    }


    return (
        <>
            <section className="card admin-form">
                <div className="admin-form__header">
                    <span className="icon-badge"><i className="fa-solid fa-plus"></i></span>
                    <h2 className="h5 fw-bold mb-0">Add New Category</h2>
                </div>
                <form className="admin-form__body" onSubmit={(e) => e.preventDefault()}>
                    <div className='row g-3'>
                        <div className="col-12 col-md-6">
                            <div className="input-icon">
                                <Input
                                    isValid={title.isValid}
                                    placeholder="Title"
                                    type="input"
                                    onChangeInput={(e) =>
                                        changeInputHandeler(e, "title", [
                                            requiredValidator(),
                                            maxValidator(20),
                                            minValidator(6),
                                        ])} />
                                <i className="fa fa-user input-icon__icon"></i>
                            </div>
                        </div>
                        <div className="col-12 col-md-6">
                            <div className="input-icon">
                                <Input
                                    isValid={shortName.isValid}
                                    placeholder="shortName"
                                    type="input"
                                    onChangeInput={(e) =>
                                        changeInputHandeler(e, "shortName", [
                                            requiredValidator(),
                                            maxValidator(20),
                                            minValidator(6),
                                        ])} />
                                <i className="fa fa-user input-icon__icon"></i>
                            </div>
                        </div>
                    </div>
                </form>

                <Button
                    className={`btn ${formState.isFormValid ? "btn-primary" : "btn-secondary"} d-inline-flex align-items-center gap-2`}
                    disabled={!formState.isFormValid} type="submit"
                    actionForm={(e) => addNewCategory(e)}>
                    <span>Create</span>
                    <i className="fa fa-plus"></i>
                </Button>
            </section>
            <DataTable title={"Categories"}>
                <table className="table table-hover align-middle mb-0">
                    <thead>
                        <tr>
                            <th className='number'>#</th>
                            <th>Name</th>
                            <th>ShortName</th>
                            <th><i className='fa fa-edit'></i></th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedData.map((item, index) => (
                            <tr key={index}>
                                <td className='number'>{index + 1}</td>
                                <td>{item.name}</td>
                                <td>{item.title}</td>
                                <td>
                                    <button
                                        className='btn btn-sm btn-primary'
                                        onClick={() => editCategory(item._id, item.name)}>
                                        Edit</button>
                                    <button
                                        onClick={(() => removeCategory(item._id))
                                        } className='btn btn-sm btn-danger'>Remove</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </DataTable>
            <Pageination
                data={paginatedData}
                pathName={`/p-admin/categories`}
                pageCount={pageCount}
                currentPage={currentPage} />
        </>
    )
}
