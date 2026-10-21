import { Suspense } from "react"
import { Outlet } from "react-router-dom"
import PageLoader from "../../components/ui/PageLoader"
import PageHeader from "../../components/layout/PageHeader"
import AccountSidebar from "../../components/layout/account/AccountSidebar"
import { useAuth } from "../../features/auth/useAuth"

export default function AccountLayout() {
    const { userInfo } = useAuth()

    return (
        <>
            <PageHeader
                title="My account"
                subtitle={userInfo.name ? `Welcome back, ${userInfo.name}` : undefined}
                breadcrumb={[{ title: "Home", to: "/" }, { title: "My account" }]} />
            <div className="container py-4 py-lg-5">
                <div className="row g-4">
                    <div className="col-12 col-lg-3">
                        <AccountSidebar />
                    </div>
                    <div className="col-12 col-lg-9">
                        <div className="card shadow-sm h-100">
                            <div className="card-body p-3 p-sm-4">
                                <Suspense fallback={<PageLoader />}>
                    <Outlet />
                </Suspense>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
