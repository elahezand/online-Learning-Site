import { useEffect, useState } from 'react'
import "../../styles/p-admin/sessions.css"
import AddNewSession from '../../components/templates/p-admin/AddNewSession/AddNewSession'
import DataTable from '../../components/modules/p-admin/DataTable/DataTable'
import Pageination from '../../components/modules/Pageination/Pageination'
import { useParams } from 'react-router-dom'
import getMe from '../../utils/auth'
import swal from 'sweetalert'

export default function Sessions() {
    const param = useParams()
    const { page } = param

    const pageSize = 10

    const [currentPage, setCurrentPage] = useState(1)
    const [sessions, setSessions] = useState([])

    const getAllSessions = async () => {
        const token = await getMe()
        const res = await fetch("http://localhost:4000/v1/courses/sessions", {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        if (res.ok) {
            const data = await res.json()
            setSessions(data)
        }

    }

    useEffect(() => {

        getAllSessions()
    }, [])

    useEffect(() => {
        setCurrentPage(page)
    }, [page, currentPage])

    const lastChild = currentPage * pageSize
    const firstChild = lastChild - pageSize

    const pageCount = Math.ceil(sessions.length / pageSize)
    const paginatedData = sessions.slice(firstChild, lastChild)

    const removeSession = async (sessionId) => {
        const token = await getMe()
        if (token) {
            swal({
                title: "are you sure to remove this session?",
                icon: "warning",
                buttons: ["No", "yes"]
            }).then(async result => {
                if (result) {
                    const res = await fetch(`http://localhost:4000/v1/courses/sessions/${sessionId}`, {
                        method: "DELETE",
                        headers: {
                            Authorization: `Bearer ${token}`

                        }
                    })
                    if (res.ok) {
                        swal({
                            title: "the session was removed suuccessfully",
                            icon: "success",
                            buttons: "ok"
                        }).then(result => {
                            getAllSessions()
                        })
                    }
                }
            })
        }

    }
    return (
        <>
            <AddNewSession getAllSessions={getAllSessions} />
            <DataTable>
                <table style={{ width: "100%" }}>
                    <thead>
                        <tr>
                            <th className='number'>#</th>
                            <th>Title</th>
                            <th>Time</th>
                            <th>Course</th>
                            <th>UpdatedAT</th>
                            <th><i className='fa fa-edit'></i></th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedData.map((item, index) => (
                            <tr key={index}>
                                <td className='number'>{index + 1}</td>
                                <td>{item.title}</td>
                                <td>{item.time}</td>
                                <td>{item.course.name}</td>
                                <td>{item.updatedAt.slice(0, 10)}</td>
                                <td>
                                    <button
                                        onClick={(() => removeSession(item._id))}
                                        className='remove-user'>Remove</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </DataTable>
            <Pageination
                data={paginatedData}
                pathName={`/p-admin/sessioدس`}
                pageCount={pageCount}
                currentPage={currentPage} />
        </>
    )
}
