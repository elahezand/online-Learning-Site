import { Navigate, useLocation } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"

function FullPageLoader() {
    return (
        <div className="d-flex justify-content-center align-items-center py-5 min-vh-100" role="status">
            <div className="spinner-border text-primary" aria-hidden="true"></div>
            <span className="visually-hidden">Loading…</span>
        </div>
    )
}

/* Logged-in users only. Guests go to /login and come back afterwards. */
export function RequireAuth({ children }) {
    const { status } = useAuth()
    const location = useLocation()

    if (status === "loading") return <FullPageLoader />
    if (status !== "authenticated") {
        return <Navigate to="/login" replace state={{ from: location }} />
    }
    return children
}

/* Logged-in users with a specific role (e.g. "ADMIN"). */
export function RequireRole({ role, children }) {
    const { status, user } = useAuth()
    const location = useLocation()

    if (status === "loading") return <FullPageLoader />
    if (status !== "authenticated") {
        return <Navigate to="/login" replace state={{ from: location }} />
    }
    if (user?.role !== role) return <Navigate to="/" replace />
    return children
}

/* Pages such as /login and /register: once logged in, send the user back
   to the page that sent them here (or home). While the session is still
   resolving we keep showing the form, so logging in doesn't flash a loader. */
export function GuestOnly({ children }) {
    const { status } = useAuth()
    const location = useLocation()
    if (status === "authenticated") {
        const from = location.state?.from
        const target = from ? `${from.pathname}${from.search || ""}${from.hash || ""}` : "/"
        return <Navigate to={target} replace />
    }
    return children
}
