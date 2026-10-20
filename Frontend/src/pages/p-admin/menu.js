import { useEffect, useState } from 'react'
import DataTable from '../../components/modules/p-admin/DataTable/DataTable'
import Input from '../../components/modules/Form/Input'
import Button from '../../components/modules/Form/Button'
import useForm from '../../Hooks/useForm'
import { requiredValidator, minValidator, maxValidator } from '../../validators/rules'
import Pageination from '../../components/modules/Pageination/Pageination'
import { useParams } from 'react-router-dom'
import swal from 'sweetalert'
import { useQueryClient } from '@tanstack/react-query'
import { attempt, menusApi, useMenus } from '../../api'

export default function Menu() {
  const param = useParams()
  const { page } = param

  const [parentId, setParentId] = useState("-1")
  const { data: allMenus = [] } = useMenus()
  const queryClient = useQueryClient()
  // Public menus (navbar/topbar) are invalidated too, so the site shows the change
  const getAllMenu = () => queryClient.invalidateQueries({ queryKey: ['menus'] })
  const [currentPage, setCurrentPage] = useState(1)

  const pageSize = 10

  const [formState, changeInputHandeler] = useForm({
    title: {
      value: "",
      isValid: false
    },

    href: {
      value: "",
      isValid: false
    },

  }, false)

  const { title, href } = formState.inputs




  useEffect(() => {
    setCurrentPage(page)
  }, [page, currentPage])

  const removeMenu = async (menuId) => {
    swal({
      title: "Are you sure to remove this menu?",
      icon: "warning",
      buttons: ["No", "yes"]
    }).then(result => {
      if (result) {
        attempt(menusApi.remove(menuId)).then(res => {
          if (res.ok) {
            swal({
              title: "the menu was removed successfully",
              icon: "success",
              buttons: "ok"
            })
          }
          getAllMenu()
        })
      }
    })


  }

  const addNewMenu = async () => {
  const res = await attempt(menusApi.create({ title: title.value, href: href.value, parent: parentId === "-1" ? undefined : parentId }))
  if (res.ok) {
    swal({
      title: "the menu was created successfully",
      icon: "success",
      buttons: "ok"
    }).then(result => {
      if (result) {
        getAllMenu()
      }
    })
  }


  }

  const lastChild = currentPage * pageSize
  const firstChild = lastChild - pageSize

  const pageCount = Math.ceil(allMenus.length / pageSize)
  const paginatedData = allMenus.slice(firstChild, lastChild)


  return (
    <>
      <section className="card admin-form">
        <div className="admin-form__header">
                    <span className="icon-badge"><i className="fa-solid fa-user-plus"></i></span>
                    <h2 className="h5 fw-bold mb-0">Add New Menu</h2>
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
                      minValidator(4),
                      maxValidator(18)
                    ])}
                />
                <i className="fa fa-user input-icon__icon"></i>
              </div>
            </div>
            <div className="col-12 col-md-6">
              <div className="input-icon">
                <Input
                  isValid={href.isValid}
                  placeholder="Href"
                  type="input"
                  onChangeInput={(e) =>
                    changeInputHandeler(e, "href", [
                      requiredValidator(),
                      minValidator(4),
                      maxValidator(18)
                    ])}
                />
                <i className="fa fa-user input-icon__icon"></i>
              </div>
            </div>
            <div className="col-12 col-md-6">
              <div>
                <select className="form-select"
                  onChange={(e) => setParentId(e.target.value)}>
                  <option value="-1">Please Select Parent </option>
                  {allMenus.length && allMenus.filter((item) => (
                    !item.parent
                  )).map((menu, index) => (
                    <option
                      key={index}
                      value={menu._id}>{menu.title} </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </form>
        <Button
          className={`btn ${formState.isFormValid ? "btn-primary" : "btn-secondary"} d-inline-flex align-items-center gap-2`}
          disabled={!formState.isFormValid} type="submit"
          actionForm={(e) => addNewMenu(e)}>
          <span>Create</span>
          <i className="fa fa-plus"></i>
        </Button>
      </section>
      <DataTable title="Menus">
        <table className="table table-hover align-middle mb-0">
          <thead>
            <tr>
              <th className='number'>#</th>
              <th>Title</th>
              <th>Link</th>
              <th>Parent</th>
              <th><i className='fa fa-edit'></i></th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((item, index) => (
              <tr key={index + 1}>
                <td className='number'>{index + 1}</td>
                <td>
                  {item.title}
                </td>
                <td>{item.href}</td>
                <td>{item.parent ? item.parent.title :
                  <span className='text-success'><i className='fa fa-check'></i></span>}
                </td>
                <td>
                  <button
                    onClick={(() => removeMenu(item._id))}
                    className='btn btn-sm btn-danger'>Remove</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </DataTable>
      <Pageination
        data={paginatedData}
        pathName={`/p-admin/menu`}
        pageCount={pageCount}
        currentPage={currentPage} />
    </>
  )
}
