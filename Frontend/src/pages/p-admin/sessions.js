import { useEffect, useState } from 'react'
import AddNewSession from '../../components/templates/p-admin/AddNewSession/AddNewSession'
import DataTable from '../../components/modules/p-admin/DataTable/DataTable'
import Pageination from '../../components/modules/Pageination/Pageination'
import { useParams } from 'react-router-dom'
import swal from 'sweetalert'
import { useQueryClient } from '@tanstack/react-query'
import { attempt, coursesApi, queryKeys, useSessions } from '../../api'

export default function Sessions() {
    const param = useParams()
    const { page } = param

    const pageSize = 10

    const [currentPage, setCurrentPage] = useState(1)
    const { data: sessions = [] } = useSessions()
    const queryClient = useQueryClient()
    const getAllSessions = () => queryClient.invalidateQueries({ queryKey: queryKeys.sessions })



    useEffect(() => {
        setCurrentPage(page)
    }, [page, currentPage])

    const lastChild = currentPage * pageSize
    const firstChild = lastChild - pageSize

    const pageCount = Math.ceil(sessions.length / pageSize)
    const paginatedData = sessions.slice(firstChild, lastChild)

    const removeSession = async (sessionId) => {
        swal({
            title: "are you sure to remove this session?",
            icon: "warning",
            buttons: ["No", "yes"]
        }).then(async result => {
            if (result) {
                const res = await attempt(coursesApi.removeSession(sessionId))
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
    return (
        <>
            <AddNewSession />
            <DataTable title="Sessions">
                <table className="table table-hover align-middle mb-0">
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
                                        className='btn btn-sm btn-danger'>Remove</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </DataTable>
            <Pageination
                data={paginatedData}
                pathName={`/p-admin/sessions`}
                pageCount={pageCount}
                currentPage={currentPage} />
        </>
    )
}
