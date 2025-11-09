import { useEffect, useState } from 'react'
import "../../styles/p-admin/contacts.css"
import DataTable from '../../components/modules/p-admin/DataTable/DataTable'
import Pageination from '../../components/modules/Pageination/Pageination'
import getMe from '../../utils/auth'
import { useParams } from 'react-router-dom'
import swal from 'sweetalert'

export default function Contacts() {

    const param = useParams()
    const { page } = param

    const pageSize = 10

    const [currentPage, setCurrentPage] = useState(1)
    const [allMessages, setAllMessages] = useState([])

    const getAllContact = async () => {
        const token = await getMe()
        if (token) {
            const res = await fetch("http://localhost:4000/v1/contact", {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            })
            if (res.ok) {
                const data = await res.json()
                setAllMessages(data)
            }
        }
    }

    useEffect(() => {
        getAllContact()
    }, [])
    const lastChild = currentPage * pageSize
    const firstChild = lastChild - pageSize

    const pageCount = Math.ceil(allMessages.length / pageSize)
    const paginatedData = allMessages.slice(firstChild, lastChild)

    useEffect(() => {
        setCurrentPage(page)
    }, [page, currentPage])

    const answerContact = async (email) => {
        const token = await getMe()
        if (token) {
            swal({
                title: "plaese send your answer",
                content: "input",
                buttons: "submit"
            }).then(async result => {
                if (result.trim().length) {
                    const res = await fetch("http://localhost:4000/v1/contact/answer", {
                        method: "POST",
                        headers: {
                            "Authorization": `Bearer ${token}`,
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            email: email,
                            answer: result
                        })

                    })
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
    }

    const readContact = (body) => {
        swal({
            title: body,
            buttons: "ok"
        })
    }

    const deleteContact = async (contactID) => {
        const token = await getMe()
        if (token) {
            swal({
                title: "are you sure to remove this contact?",
                icon: "warning",
                buttons: ["No", "yes"]
            }).then(async result => {
                if (result) {
                    const res = await fetch(`http://localhost:4000/v1/contact/${contactID}`, {
                        method: "DELETE",
                        headers: {
                            "Authorization": `Bearer ${token}`,

                        }
                    })
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
    }

    return (
        <>
            <DataTable ble title={"Contacts"}>
                <table style={{ width: "100%" }}>
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
                                        className='edit-user'
                                        onClick={() => readContact(item.body)}>Content</button>
                                </td>
                                <td>
                                    <button
                                        onClick={() => answerContact(item.email)}
                                        className='edit-user' >Answer</button>
                                    <button
                                        className='remove-user'
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
