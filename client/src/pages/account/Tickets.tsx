import { FaEye, FaPlus, FaSquarePen } from "react-icons/fa6"
import { StatusBadge } from "../../components/ui/ActionButton"
import Pagination from '../../components/ui/Pagination'
import usePagination from '../../hooks/usePagination'
import { Link } from 'react-router-dom'
import { messageToast } from '../../components/ui/toastActions'
import { useMyTickets } from '../../features/tickets/hooks'
import type { Ticket } from '../../types/models'



export default function Tickets() {
  const { data: tickets = [] } = useMyTickets()
  const { page, pageCount, start, pageItems: paginatedData } = usePagination(tickets)


  const showTicket = (ticket: Ticket) => messageToast(ticket.title, ticket.body)


  return (
    <>
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
        <h2 className="h4 fw-bold mb-0">All Tickets</h2>
        <Link className="btn btn-primary" to="/my-account/add-newTicket">
          <FaPlus className="me-2" />
          Add New Ticket
        </Link>
      </div>
      {paginatedData.length ?
        <>
          <div className="table-responsive">
          <table className="table table-hover align-middle text-nowrap">
            <thead>
              <tr>
                <th className="text-body-secondary">#</th>
                <th>Title</th>
                <th>Department</th>
                <th>Created</th>
                <th>Status</th>
                <th>
                  <FaSquarePen />
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((item, index) => (
                <tr key={item._id}>
                  <td className="text-body-secondary">
                    {start + index + 1}
                  </td>
                  <td>
                    {item.answer ?
                      <Link to={`/my-account/ticket/answer/${item._id}`}>
                        {item.title}
                      </Link> : item.title}
                  </td>
                  <td>{item.departmentID}</td>
                  <td>{item.createdAt?.slice(0, 10)}</td>
                  <td>
                    <StatusBadge ok={item.answer > 0} okLabel="Answered" pendingLabel="Open" />
                  </td>
                  <td>
                    <button
                      onClick={() => showTicket(item)}
                      className='btn btn-sm btn-outline-secondary d-inline-flex align-items-center gap-1'><FaEye /> View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </>
        :
        <div className="alert alert-primary">You haven't sent any tickets yet.</div>

      }
      <Pagination page={page} pageCount={pageCount} />
    </>
  )
}
