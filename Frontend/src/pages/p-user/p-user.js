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
            <Suspense fallback={<div className="landing-fallback">Loading…</div>}>
                <Landing url="/images/blog/bg_2.jpg.webp" />
            </Suspense>
            <div className='container mt-4 mb-5'>
                <div className='row g-4'>
                    <div className='col-12 col-lg-3'>
                        <SideBar />
                    </div>
                    <main className='col-12 col-lg-9'>
                        <div className='surface p-3 p-sm-4 h-100'>
                            <Outlet />
                        </div>
                    </main>
                </div>
            </div>
            <Footer />

        </>
    )
}
