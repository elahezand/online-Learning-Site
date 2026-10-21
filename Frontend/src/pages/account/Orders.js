import { useMemo } from 'react'
import Pagination from '../../components/ui/Pagination'
import usePagination from '../../hooks/usePagination'
import { useMyOrders } from '../../features/orders/hooks'

const EMPTY = []

export default function Orders() {
  const { data: allOrders = EMPTY } = useMyOrders()
  const orders = useMemo(() => allOrders.filter(order => order.price > 0), [allOrders])
  const { page, pageCount, start, pageItems: paginatedData } = usePagination(orders)

  return (
    <>
      {orders.length ?
        <>
          <h2 className="h4 fw-bold mb-3">Orders</h2>
          <div className="table-responsive">
          <table className="table table-hover align-middle text-nowrap">
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
                  <td className='text-body-secondary'>{start + index + 1}</td>
                  <td className='fw-medium text-body-emphasis'>
                    {order.course?.name}
                  </td>
                  <td>
                    {order.createdAt.slice(0, 10)}
                  </td>
                  <td>
                    <span className={`badge rounded-pill ${order.isComplete ? "text-bg-success" : "bg-primary-subtle text-primary-emphasis"}`}>
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
          <Pagination page={page} pageCount={pageCount} />
        </>
        :
        <div className='alert alert-danger'>there isn't any orders</div>}
    </>
  )
}


