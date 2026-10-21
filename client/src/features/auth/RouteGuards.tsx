import type { ReactNode } from "react"
import { Navigate, useLocation } from "react-router-dom"
import type { Location } from "react-router-dom"
import type { Role } from "../../types/models"
import { useAuth } from "./useAuth"
import PageLoader from "../../components/ui/PageLoader"

/* Logged-in users only. Guests go to /login and come back afterwards. */
export function RequireAuth({ children }: { children: ReactNode }) {
    const { status } = useAuth()
    const location = useLocation()

    if (status === "loading") return <PageLoader fullPage />
    if (status !== "authenticated") {
        return <Navigate to="/login" replace state={{ from: location }} />
    }
    return children
}

/* Logged-in users with a specific role (e.g. "ADMIN"). */
export function RequireRole({ role, children }: { role: Role; children: ReactNode }) {
    const { status, user } = useAuth()
    const location = useLocation()

    if (status === "loading") return <PageLoader fullPage />
    if (status !== "authenticated") {
        return <Navigate to="/login" replace state={{ from: location }} />
    }
    if (user?.role !== role) return <Navigate to="/" replace />
    return children
}

/* Pages such as /login and /register: once logged in, send the user back
   to the page that sent them here (or home). While the session is still
   resolving we keep showing the form, so logging in doesn't flash a loader. */
export function GuestOnly({ children }: { children: ReactNode }) {
    const { status } = useAuth()
    const location = useLocation()
    if (status === "authenticated") {
        const from = (location.state as { from?: Location } | null)?.from
        const target = from ? `${from.pathname}${from.search || ""}${from.hash || ""}` : "/"
        return <Navigate to={target} replace />
    }
    return children
}
