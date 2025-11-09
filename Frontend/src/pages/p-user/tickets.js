import { useEffect, useState } from 'react'
import Pageination from '../../components/modules/Pageination/Pageination'
import { Link } from 'react-router-dom'
import { useParams } from 'react-router-dom'
import "../../styles/p-user/tickets.css"
import swal from 'sweetalert'
import getMe from '../../utils/auth'



export default function Tickets() {
  const param = useParams()
  const { page } = param

  const pageSize = 10

  const [tickets, setTickets] = useState([])
  const [currentPage, setCurrentPage] = useState(1)

  const getTickets = async () => {
    const token = await getMe()
    if (token) {
      const res = await fetch("http://localhost:4000/v1/tickets/user", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token} `
        }
      })
      if (res.ok) {
        const data = await res.json()
        setTickets(data)
      }
    }
  }

  useEffect(() => {
    getTickets()
  }, [])

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
      <div className="ticket-header">
        <span className="ticket-header__title"> All Tickets</span>
        <Link className="ticket-header__link" to="/my-account/Add-newTicket">
          Add New Ticket
        </Link>
      </div>
      {paginatedData.length ?
        <>
          <table className="table table-striped">
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
                  <td
                    className={`number ${item.answer && 'active'}`}>
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
                    {item.answer > 0 ? <i className="fa-solid fa-check"></i>
                      : null}
                  </td>
                  <td>
                    <button
                      onClick={() => showTicket(item.body)}
                      className='edit-user'>Content</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
        :
        <div
          className='alert alert-danger'>
          there isn't any Tickets</div>

      }
      <Pageination
        data={paginatedData}
        pathName={`/my-accounts/tickets`}
        pageCount={pageCount}
        currentPage={currentPage} />
    </>
  )
}
