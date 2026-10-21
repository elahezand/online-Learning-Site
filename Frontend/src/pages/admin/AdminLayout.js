import { useState } from "react"
import { Outlet } from "react-router-dom"
import AdminSidebar from "../../components/layout/admin/AdminSidebar"
import AdminTopbar from "../../components/layout/admin/AdminTopbar"

/* Admin shell: topbar, sidebar (off-canvas below lg), page content */
export default function AdminLayout() {
    const [showSidebar, setShowSidebar] = useState(false)

    return (
        <div className="min-vh-100">
            <AdminTopbar onMenuClick={() => setShowSidebar(true)} />
            <div className="container-fluid">
                <div className="row">
                    <div className="col-lg-3 col-xxl-2 py-lg-4">
                        <AdminSidebar show={showSidebar} onHide={() => setShowSidebar(false)} />
                    </div>
                    <main className="col-lg-9 col-xxl-10 py-4 pb-5">
                        <Outlet />
                    </main>
                </div>
            </div>
        </div>
    )
}
