import { Suspense, useState } from "react"
import { Outlet } from "react-router-dom"
import AdminSidebar from "../../ui/admin/AdminSidebar"
import AdminTopbar from "../../ui/admin/AdminTopbar"
import PageLoader from "../../ui/PageLoader"

const COLLAPSED_KEY = "adminSidebarCollapsed"

const readCollapsed = () => {
    try { return localStorage.getItem(COLLAPSED_KEY) === "1" } catch { return false }
}

export default function AdminLayout() {
    const [showSidebar, setShowSidebar] = useState(false)
    const [collapsed, setCollapsed] = useState(readCollapsed)

    const toggleCollapsed = () => setCollapsed(value => {
        try { localStorage.setItem(COLLAPSED_KEY, value ? "0" : "1") } catch { /* storage unavailable */ }
        return !value
    })

    return (
        <div className="min-vh-100">
            <AdminTopbar onMenuClick={() => setShowSidebar(true)} />
            <div className="container-fluid">
                <div className="row">
                    <div className={`py-lg-4 ${collapsed ? "col-lg-auto" : "col-lg-3 col-xxl-2"}`}>
                        <AdminSidebar show={showSidebar} onHide={() => setShowSidebar(false)}
                            collapsed={collapsed} onToggle={toggleCollapsed} />
                    </div>
                    <main className={`py-4 pb-5 ${collapsed ? "col-lg" : "col-lg-9 col-xxl-10"}`} style={{ minWidth: 0 }}>
                        <Suspense fallback={<PageLoader />}>
                            <Outlet />
                        </Suspense>
                    </main>
                </div>
            </div>
        </div>
    )
}