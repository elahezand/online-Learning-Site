import { useState, useEffect } from 'react'
import DataTable from '../../components/modules/p-admin/DataTable/DataTable'
import Pageination from '../../components/modules/Pageination/Pageination'
import { useParams } from 'react-router-dom'
import swal from 'sweetalert'
import { useQueryClient } from '@tanstack/react-query'
import { attempt, queryKeys, ticketsApi, useTickets } from '../../api'

export default function TicketsAdmin() {
    const param = useParams()
    const { page } = param

    const pageSize = 10

    const [currentPage, setCurrentPage] = useState(1)
    const { data: allTickets = [] } = useTickets()
    const queryClient = useQueryClient()
    const getAllTickets = () => queryClient.invalidateQueries({ queryKey: queryKeys.tickets })



    useEffect(() => {
        setCurrentPage(page)
    }, [page, currentPage])

    const lastChild = currentPage * pageSize
    const firstChild = lastChild - pageSize

    const pageCount = Math.ceil(allTickets.length / pageSize)
    const paginatedData = allTickets.slice(firstChild, lastChild)

    const answerTicket = async (Id) => {
        swal({
            title: "Please send your response",
            content: "input",
            buttons: "Send"
        }).then(async result => {
            if (result) {
                const res = await attempt(ticketsApi.answer(Id, result))
                if (res.ok) {
                    swal({
                        title: "Your respond was sended successfully",
                        icon: "success",
                        buttons: "ok"
                    }).then(result => {
                        getAllTickets()
                    })
                }

            }
        })
    }

    const readTicket = (body) => {
        swal({
            title: body,
            buttons: "ok"
        })
    }


    return (
        <>
            <DataTable title={"Tickets"}>
                <table className="table table-hover align-middle mb-0">
                    <thead>
                        <tr>
                            <th className='number'>#</th>
                            <th>User</th>
                            <th>Title</th>
                            <th>Course</th>
                            <th>priority</th>
                            <th>Department</th>
                            <th>CreatedAt</th>
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
                                <td>{item.user}</td>
                                <td>{item.title}</td>
                                <td>{item.course ? item.course : "__"}</td>
                                <td>{item.departmentID}</td>
                                <td>{item.createdAt.slice(0, 10)}</td>
                                <td>{item.priority === 3 ? "Hight" :
                                    item.priority === 2 ? "Medium" :
                                        item.priority === 1 ? "Low" : null}</td>

                                <td>
                                    <button
                                        className='btn btn-sm btn-primary'
                                        onClick={() => readTicket(item.body)}>Content</button>
                                </td>
                                <td>
                                    <button
                                        onClick={() => answerTicket(item._id)}
                                        className='btn btn-sm btn-primary'
                                    >Answer</button>

                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </DataTable>
            <Pageination
                data={paginatedData}
                pathName={`/p-admin/tickets`}
                pageCount={pageCount}
                currentPage={currentPage} />

        </>
    )
}
