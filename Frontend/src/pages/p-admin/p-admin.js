import Sidebar from '../../components/modules/p-admin/Sideabar/Sidebar.js'
import Topbar from '../../components/modules/p-admin/Topbar/Topbar.js'
import { Outlet } from 'react-router-dom'


export default function AdminPanel() {
    return (
        <>
            <Topbar />
            <div className='row'>
                <Sidebar />
                <div className='col-10 mt-3'
                    style={{ paddingRight: "3rem" }}>
                    <Outlet />
                </div>
            </div>
        </>

    )
}
