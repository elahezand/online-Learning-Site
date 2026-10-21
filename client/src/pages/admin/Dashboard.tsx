import { FaChartSimple } from 'react-icons/fa6'
import { useAdminDashboard } from '../../features/info/hooks'
import DashboardChart from '../../features/info/DashboardChart'
import DataTable from '../../components/ui/DataTable'


export default function Dashboard() {
    const { data } = useAdminDashboard()
    const lastUsers = data?.lastUsers ?? []
    const infos = data?.infos ?? []




    return (
        <>
            <h1 className="h4 fw-bold mb-4">Dashboard</h1>
            <div className="row row-cols-1 row-cols-sm-2 row-cols-xl-3 g-3">
                {infos.map(item => (
                    <div key={item.title} className="col">
                        <div className="card h-100 shadow-sm">
                            <div className="card-body">
                                <div className="d-flex align-items-center justify-content-between">
                                    <h2 className="h6 text-body-secondary mb-0">{item.title}</h2>
                                    <span className="d-inline-flex align-items-center justify-content-center rounded-3 bg-primary-subtle text-primary-emphasis p-2 lh-1"><FaChartSimple /></span>
                                </div>
                                <div className="fs-2 fw-bold text-body-emphasis mt-2">{item.count?.toLocaleString()}</div>
                                <div className="small text-body-secondary">Compared to last month</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <DashboardChart />
            <DataTable title="Recent Users">
                <table className="table table-hover align-middle text-nowrap mb-0">
                    <thead>
                        <tr>
                            <th className='text-body-secondary'>#</th>
                            <th>Name</th>
                            <th>Username</th>
                            <th>Phone</th>
                            <th>Email</th>
                        </tr>
                    </thead>
                    <tbody>
                        {lastUsers.map((item, index) => (
                            <tr key={index}>
                                <td className='text-body-secondary'>{index + 1}</td>
                                <td>{item.name}</td>
                                <td>{item.username}</td>
                                <td>{item.phone}</td>
                                <td>{item.email}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </DataTable>
        </>
    )
}
