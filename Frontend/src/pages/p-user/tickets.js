import { useEffect, useState } from 'react'
import Pageination from '../../components/modules/Pageination/Pageination'
import { Link } from 'react-router-dom'
import { useParams } from 'react-router-dom'
import swal from 'sweetalert'
import { useMyTickets } from '../../api'



export default function Tickets() {
  const param = useParams()
  const { page } = param

  const pageSize = 10

  const { data: tickets = [] } = useMyTickets()
  const [currentPage, setCurrentPage] = useState(1)



  useEffect(() => {
    setCurrentPage(page)
  }, [page, currentPage])

  const lastChild = currentPage * pageSize
  const firstChild = lastChild - pageSize

  const pageCount = Math.ceil(tickets.length / pageSize)
  const paginatedData = tickets.slice(firstChild, lastChild)


  const showTicket = (body) => {
    swal({
      title: body,
      buttons: "ok"
    })
  }


  return (
    <>
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
        <h1 className="h4 mb-0">All Tickets</h1>
        <Link className="btn btn-primary" to="/my-account/add-newTicket">
          <i className="fa fa-plus me-2"></i>
          Add New Ticket
        </Link>
      </div>
      {paginatedData.length ?
        <>
          <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead>
              <tr>
                <th>#</th>
                <th>Title</th>
                <th>Department</th>
                <th>createdAt</th>
                <th>Answer</th>
                <th>
                  <i className="fa-solid fa-square-pen"></i>
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((item, index) => (
                <tr key={index}>
                  <td className={`fw-bold ${item.answer ? "text-primary-strong" : "text-body-secondary"}`}>
                    {index + 1}
                  </td>
                  <td>
                    {item.answer ?
                      <Link to={`/my-account/ticket/answer/${item._id}`}>
                        {item.title}
                      </Link> : item.title}
                  </td>
                  <td>{item.departmentID}</td>
                  <td>{item.createdAt.slice(0, 10)}</td>
                  <td>
                    {item.answer > 0 ? <i className="fa-solid fa-check text-success"></i>
                      : null}
                  </td>
                  <td>
                    <button
                      onClick={() => showTicket(item.body)}
                      className='btn btn-sm btn-outline-primary'>Content</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </>
        :
        <div
          className='alert alert-danger'>
          there isn't any Tickets</div>

      }
      <Pageination
        data={paginatedData}
        pathName={`/my-account/tickets`}
        pageCount={pageCount}
        currentPage={currentPage} />
    </>
  )
}
