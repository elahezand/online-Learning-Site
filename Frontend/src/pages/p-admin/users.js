import { useState, useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { attempt, queryKeys, useUsers, usersApi } from '../../api'
import DataTable from '../../components/modules/p-admin/DataTable/DataTable.js'
import Pageination from '../../components/modules/Pageination/Pageination.js'
import AddNewUser from '../../components/templates/p-admin/AddNewUser/AddNewUser.js'
import { useParams } from 'react-router-dom'
import swal from 'sweetalert'


export default function Users() {
    const param = useParams()
    const { page } = param

    const pageSize = 10

    const [currentPage, setCurrentPage] = useState(1)
    const { data: allUsers = [] } = useUsers()
    const queryClient = useQueryClient()
    const getAllUsers = () => queryClient.invalidateQueries({ queryKey: queryKeys.users })

    useEffect(() => {
        setCurrentPage(page)
    }, [page, currentPage])

    const lastChild = currentPage * pageSize
    const firstChild = lastChild - pageSize

    const pageCount = Math.ceil(allUsers.length / pageSize)
    const paginatedData = allUsers.slice(firstChild, lastChild)


    const removeUser = (id) => {
        swal({
            title: "are you sure to remove this user?",
            icon: "warning",
            buttons: ["No", "Yes"]
        }).then(async result => {
            if (result) {
                const res = await attempt(usersApi.remove(id))
                if (res.ok) {
                    swal({
                        title: "the user was removed successfully!",
                        icon: "success",
                        button: "ok"
                    }).then(result => {
                        if (result) {
                            getAllUsers()
                        }
                    })
                }
            }
        })
    }

    const banUser = (id) => {
        swal({
            title: "are you sure BAN this user?",
            icon: "warning",
            buttons: ["No", "Yes"]
        }).then(async result => {
            if (result) {
                const res = await attempt(usersApi.ban(id))
                if (res.ok) {
                    swal({
                        title: "the user was banned successfully!",
                        icon: "success",
                        button: "ok"
                    }).then(result => {
                        if (result) {
                            getAllUsers()
                        }
                    })
                }
            }
        })

    }

    const editRole = async (Id) => {
        swal({
            title: "Please SEND New role...",
            content: "input"
        }).then(async result => {
            if (result) {
                const res = await attempt(usersApi.changeRole(Id, result.toUpperCase()))
                if (res.ok) {
                    swal({
                        title: "The role was changged successfully!",
                        icon: "success",
                        button: "ok"
                    })
                    getAllUsers()
                }
            }

        })
    }


    return (
        <>
            <AddNewUser />
            <DataTable title="Users">
                <table className="table table-hover align-middle mb-0">
                    <thead>
                        <tr>
                            <th className='number'>#</th>
                            <th>Name</th>
                            <th>Username</th>
                            <th>Phone</th>
                            <th>Role</th>
                            <th>Email</th>
                            <th><i className='fa fa-edit'></i></th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedData.map((item, index) => (
                            <tr key={index}>
                                <td className='number'>{index + 1}</td>
                                <td>{item.name}</td>
                                <td>{item.username}</td>
                                <td>{item.phone}</td>
                                <td>{item.role}</td>
                                <td>{item.email}</td>
                                <td>
                                    <button
                                        onClick={(() => removeUser(item._id))}
                                        className='btn btn-sm btn-danger'>Remove</button>
                                    <button
                                        className='btn btn-sm btn-primary'
                                        onClick={() => editRole(item._id)}>Edit Role</button>
                                    <button
                                        className='btn btn-sm btn-outline-danger'
                                        onClick={() => banUser(item._id)}>Ban</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

            </DataTable>
            <Pageination
                data={paginatedData}
                pathName={`/p-admin/users`}
                pageCount={pageCount}
                currentPage={currentPage} />
        </>

    )
}
