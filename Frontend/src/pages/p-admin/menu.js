import { useEffect, useState } from 'react'
import DataTable from '../../components/modules/p-admin/DataTable/DataTable'
import Input from '../../components/modules/Form/Input'
import Button from '../../components/modules/Form/Button'
import useForm from '../../Hooks/useForm'
import { requiredValidator, minValidator, maxValidator } from '../../validators/rules'
import Pageination from '../../components/modules/Pageination/Pageination'
import { useParams } from 'react-router-dom'
import getMe from '../../utils/auth'
import swal from 'sweetalert'

export default function Menu() {
  const param = useParams()
  const { page } = param

  const [parentId, setParentId] = useState("-1")
  const [allMenus, setAllMenus] = useState([])
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

  const getAllMenu = async () => {
    const token = await getMe()
    const res = await fetch("http://localhost:4000/v1/menus/all", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    })
    if (res.ok) {
      const data = await res.json()
      setAllMenus(data)
    }
  }

  useEffect(() => {
    getAllMenu()
  }, [])


  useEffect(() => {
    setCurrentPage(page)
  }, [page, currentPage])

  const removeMenu = async (menuId) => {
    const token = await getMe()
    swal({
      title: "Are you sure to remove this menu?",
      icon: "warning",
      buttons: ["No", "yes"]
    }).then(result => {
      if (result) {
        fetch(`http://localhost:4000/v1/menus/${menuId}`, {
          method: "DELETE",
          headers: {
            "Authorization": `Bearer ${token}`
          }
        }).then(res => {
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
    const token = await getMe()
    if (token) {
      const res = await fetch(`http://localhost:4000/v1/menus/`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"


        },
        body: JSON.stringify({
          title: title.value,
          href: href.value,
          parent: parentId === "-1" ? undefined : parentId
        })
      })
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

  }

  const lastChild = currentPage * pageSize
  const firstChild = lastChild - pageSize

  const pageCount = Math.ceil(allMenus.length / pageSize)
  const paginatedData = allMenus.slice(firstChild, lastChild)


  return (
    <>
      <div className="form-container">
        <div className='form-header'>
          <i className="fa-solid fa-user-plus"></i>
          <h1>Add New Menu</h1>
        </div>
        <form className="form">
          <div className='row'>
            <div className="col-6">
              <div className="register-form__username">
                <Input
                  isValid={title.isValid}
                  className="register-form__username-input"
                  placeholder="Title"
                  type="input"
                  onChangeInput={(e) =>
                    changeInputHandeler(e, "title", [
                      requiredValidator(),
                      minValidator(4),
                      maxValidator(18)
                    ])}
                />
                <i className="fa fa-user register-form__username-icon"></i>
              </div>
            </div>
            <div className="col-6">
              <div className="register-form__username">
                <Input
                  isValid={href.isValid}
                  className="register-form__username-input"
                  placeholder="Href"
                  type="input"
                  onChangeInput={(e) =>
                    changeInputHandeler(e, "href", [
                      requiredValidator(),
                      minValidator(4),
                      maxValidator(18)
                    ])}
                />
                <i className="fa fa-user register-form__username-icon"></i>
              </div>
            </div>
            <div className="col-6">
              <div className="categories">
                <select className="category-list"
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
          className={`form__btn ${formState.isFormValid ? "active" : null}`}
          disabled={!formState.isFormValid} type="submit"
          actionForm={(e) => addNewMenu(e)}>
          <span className="form__btn-text">Create</span>
          <i className="fa fa-plus form__btn-icon"></i>
        </Button>
      </div>
      <DataTable title="Menus">
        <table style={{ width: "100%" }}>
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
                  <span> <i className='fa fa-check'></i></span>}
                </td>
                <td>
                  <button
                    onClick={(() => removeMenu(item._id))}
                    className='remove-user'>Remove</button>
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
