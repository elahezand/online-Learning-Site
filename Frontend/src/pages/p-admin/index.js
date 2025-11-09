import { useState, useEffect } from 'react'
import Chart from '../../components/templates/p-admin/Chart/Chart'
import DataTable from '../../components/modules/p-admin/DataTable/DataTable'
import getMe from '../../utils/auth'
import "../../styles/p-admin/index.css"


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
            <div className='row'>
                {infos.length ? infos.map((item, index) => (
                    <div key={index} className='col-4'>
                        <div className='container-widget'>
                            <div className='widget-header'>
                                <i className={item.icon}></i>
                                <h1 className='widget-title'>{item.title}</h1>
                            </div>
                            <div className='widget-detail'>
                                <span>{item.count}</span>
                                <i className='fa fa-arrow-down'></i>
                            </div>
                            <span className='widget-detail'>
                                Compared to last moounth
                            </span>
                        </div>
                    </div>
                )) : null}
            </div>
            <Chart />
            <DataTable title="Recent Users">
                <table style={{ width: "100%" }}>
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
