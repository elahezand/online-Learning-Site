import { useState, useEffect } from 'react'
import Chart from '../../components/templates/p-admin/Chart/Chart'
import DataTable from '../../components/modules/p-admin/DataTable/DataTable'
import getMe from '../../utils/auth'


export default function PanelAdminIndex() {
    const [lastUsers, setLastUsers] = useState([])
    const [infos, setInfoes] = useState([])

    const getLastUsers = async () => {
        const token = await getMe()
        const res = await fetch("http://localhost:4000/v1/infos/p-admin", {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        if (res.ok) {
            const data = await res.json()
            setLastUsers(data.lastUsers);
            setInfoes(data.infos)
        }

    }

    useEffect(() => {
        getLastUsers()
    }, [])


    return (
        <>
            <div className='row row-cols-1 row-cols-sm-2 row-cols-xl-3 g-3'>
                {infos.length ? infos.map((item, index) => (
                    <div key={index} className='col'>
                        <div className='card stat-widget'>
                            <div className='d-flex align-items-center gap-3'>
                                <span className="icon-badge"><i className={item.icon}></i></span>
                                <h2 className='h6 fw-bold mb-0'>{item.title}</h2>
                            </div>
                            <div className='d-flex align-items-center gap-2'>
                                <span className="stat-widget__count">{item.count}</span>
                                <i className='fa fa-arrow-down text-danger'></i>
                            </div>
                            <span className='small text-body-secondary'>
                                Compared to last moounth
                            </span>
                        </div>
                    </div>
                )) : null}
            </div>
            <Chart />
            <DataTable title="Recent Users">
                <table className="table table-hover align-middle mb-0">
                    <thead>
                        <tr>
                            <th className='number'>#</th>
                            <th>Name</th>
                            <th>Username</th>
                            <th>Phone</th>
                            <th>Email</th>
                        </tr>
                    </thead>
                    <tbody>
                        {lastUsers.map((item, index) => (
                            <tr key={index}>
                                <td className='number'>{index + 1}</td>
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
