import { Suspense } from "react"
import { Outlet } from "react-router-dom"
import PageLoader from "../ui/PageLoader"
import Topbar from "./Topbar"
import Navbar from "./Navbar"
import Footer from "./Footer"

/* Shell for every public page: header on top, footer at the bottom,
   the page itself in between (React Router <Outlet />). */
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
