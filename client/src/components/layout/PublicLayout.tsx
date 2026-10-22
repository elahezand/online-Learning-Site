import { Suspense } from "react"
import { Outlet } from "react-router-dom"
import PageLoader from "../ui/PageLoader"
import Topbar from "../ui/Topbar"
import Navbar from "../ui/Navbar"
import Footer from "../ui/Footer"

export default function PublicLayout() {
    return (
        <div className="d-flex flex-column min-vh-100">
            <Topbar />
            <Navbar />
            <main className="flex-grow-1">
                <Suspense fallback={<PageLoader />}>
                    <Outlet />
                </Suspense>
            </main>
            <Footer />
        </div>
    )
}
