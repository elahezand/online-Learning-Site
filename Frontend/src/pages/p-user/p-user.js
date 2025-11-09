import React, { Suspense } from 'react'
import Topbar from '../../components/modules/Topbar/Topbar'
import Footer from '../../components/modules/Footer/Footer'
import SideBar from '../../components/modules/p-user/SideBar/SideBar'
import { Outlet } from 'react-router-dom'

const Landing = React.lazy(() =>
    import('../../components/modules/Landing/Landing'))
export default function UserPanel() {
    return (
        <>
            <Topbar />
            <Suspense fallback={<span>loading....</span>}>
                <Landing url="/images/blog/bg_2.jpg.webp" />
            </Suspense>
            <div className='row'>
                <SideBar />
                <div
                    className='col-9 mt-3'
                    style={{ padding: "0 2rem" }}>
                    <Outlet />
                </div>
            </div>
            <Footer />

        </>
    )
}
