import { useState } from 'react'
import Sidebar from '../../components/modules/p-admin/Sideabar/Sidebar.js'
import Topbar from '../../components/modules/p-admin/Topbar/Topbar.js'
import { Outlet } from 'react-router-dom'
import "../../styles/p-admin/admin.css"


export default function AdminPanel() {
    const [showSidebar, setShowSidebar] = useState(false)

    return (
        <>
            <Topbar onMenuClick={() => setShowSidebar(true)} />
            <div className='admin-layout'>
                <Sidebar show={showSidebar} onHide={() => setShowSidebar(false)} />
                <main className='admin-main'>
                    <Outlet />
                </main>
            </div>
        </>
    )
}
