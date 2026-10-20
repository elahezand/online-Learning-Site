import { useEffect, useState } from 'react'
import DataTable from '../../components/modules/p-admin/DataTable/DataTable'
import Pageination from '../../components/modules/Pageination/Pageination'
import { useParams } from 'react-router-dom'
import swal from 'sweetalert'
import { useQueryClient } from '@tanstack/react-query'
import { attempt, contactsApi, queryKeys, useContacts } from '../../api'

export default function Contacts() {

    const param = useParams()
    const { page } = param

    const pageSize = 10

    const [currentPage, setCurrentPage] = useState(1)
    const { data: allMessages = [] } = useContacts()
    const queryClient = useQueryClient()
    const getAllContact = () => queryClient.invalidateQueries({ queryKey: queryKeys.contacts })


    const lastChild = currentPage * pageSize
    const firstChild = lastChild - pageSize

    const pageCount = Math.ceil(allMessages.length / pageSize)
    const paginatedData = allMessages.slice(firstChild, lastChild)

    useEffect(() => {
        setCurrentPage(page)
    }, [page, currentPage])

    const answerContact = async (email) => {
        swal({
            title: "plaese send your answer",
            content: "input",
            buttons: "submit"
        }).then(async result => {
            if (result.trim().length) {
                const res = await attempt(contactsApi.answer(email, result))
                if (res.ok) {
                    swal({
                        title: "your answer was sended successfully",
                        icon: "success",
                        buttons: "ok"
                    }).then(result => {
                        if (result) {
                            getAllContact()
                        }
                    })
                }
            }
        })
    
    }

    const readContact = (body) => {
        swal({
            title: body,
            buttons: "ok"
        })
    }

    const deleteContact = async (contactID) => {
        swal({
            title: "are you sure to remove this contact?",
            icon: "warning",
            buttons: ["No", "yes"]
        }).then(async result => {
            if (result) {
                const res = await attempt(contactsApi.remove(contactID))
                if (res.ok) {
                    swal({
                        title: "the contact was removed successfully",
                        icon: "success",
                        buttons: "ok"
                    }).then(result => {
                        if (result) {
                            getAllContact()
                        }
                    })
                }
            }
        })
    
    }

    return (
        <>
            <DataTable title={"Contacts"}>
                <table className="table table-hover align-middle mb-0">
                    <thead>
                        <tr>
                            <th className='number'>#</th>
                            <th>Name</th>
                            <th>CreatedAt</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Content</th>
                            <th><i className='fa fa-edit'></i></th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedData.map((item, index) => (
                            <tr key={index}>
                                <td
                                    className={`number ${item.answer && 'active'}`}>
                                    {index + 1}</td>
                                <td>{item.name}</td>
                                <td>{item.createdAt.slice(0, 10)}</td>
                                <td>{item.email}</td>
                                <td>{item.phone}</td>
                                <td>
                                    <button
                                        className='btn btn-sm btn-primary'
                                        onClick={() => readContact(item.body)}>Content</button>
                                </td>
                                <td>
                                    <button
                                        onClick={() => answerContact(item.email)}
                                        className='btn btn-sm btn-primary' >Answer</button>
                                    <button
                                        className='btn btn-sm btn-danger'
                                        onClick={() => deleteContact(item._id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </DataTable>
            <Pageination
                data={paginatedData}
                pathName={`/p-admin/contacts`}
                pageCount={pageCount}
                currentPage={currentPage} />
        </>
    )
}
