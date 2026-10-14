import { useEffect, useState } from 'react'
import Pageination from '../../components/modules/Pageination/Pageination'
import { useParams } from 'react-router-dom'
import getMe from '../../utils/auth'

export default function Orders() {
  const param = useParams()
  const { page } = param

  const pageSize = 5

  const [orders, setOrders] = useState([])
  const [currentPage, setCurrentPage] = useState(1)

  const getAllOrders = async () => {
    const token = await getMe()
    if (token) {
      const res = await fetch("http://localhost:4000/v1/orders", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token} `
        }
      })
      if (res.ok) {
        const data = await res.json()
        setOrders(data.filter(order => order.price > 0))
      }
    }
  }

  useEffect(() => {
    getAllOrders()
  }, [])

  useEffect(() => {
    setCurrentPage(page)
  }, [page, currentPage])

  const lastChild = currentPage * pageSize
  const firstChild = lastChild - pageSize

  const pageCount = Math.ceil(orders.length / pageSize)
  const paginatedData = orders.slice(firstChild, lastChild)

  return (
    <>
      {orders.length ?
        <>
          <h1 className="h4 mb-3">Orders</h1>
          <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead>
              <tr>
                <th>#</th>
                <th>Course</th>
                <th>CreatedAt</th>
                <th>Status</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.length ? paginatedData.map((order, index) => (
                <tr key={index}>
                  <td className='fw-bold text-body-secondary'>{index + 1}</td>
                  <td className='fw-medium text-heading'>
                    {order.course?.name}
                  </td>
                  <td>
                    {order.createdAt.slice(0, 10)}
                  </td>
                  <td>
                    <span className={`badge rounded-pill ${order.isComplete ? "text-bg-success" : "bg-primary-subtle-token text-primary-strong"}`}>
                      {order.isComplete ? "completed" : "uncompleted"}
                    </span>
                  </td>
                  <td>{order.price === 0 ? "Free" :
                    `${order.price.toLocaleString()}$`}</td>
                </tr>
              )
              ) : <tr><td colSpan={5}><div className='alert alert-danger mb-0'>
                there isn't any orders</div></td></tr>}
            </tbody>
          </table>
          </div>
          <Pageination
            data={paginatedData}
            pathName={`/my-account/orders`}
            pageCount={pageCount}
            currentPage={currentPage} />
        </>
        :
        <div className='alert alert-danger'>there isn't any orders</div>}
    </>
  )
}


