import { render, screen } from "@testing-library/react"
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom"
import AuthContext from "../AuthContext"
import type { AuthContextValue, AuthStatus } from "../AuthContext"
import type { Role, User } from "../../../types/models"
import { GuestOnly, RequireAuth, RequireRole } from "../RouteGuards"

const LoginPage = () => {
    const { state } = useLocation() as { state: { from?: { pathname: string } } | null }
    return <p>login page (from {state?.from?.pathname ?? "-"})</p>
}

const renderAt = (path: string, auth: AuthContextValue) => render(
    <AuthContext.Provider value={auth}>
        <MemoryRouter initialEntries={[path]}>
            <Routes>
                <Route path="/" element={<p>home</p>} />
                <Route path="/login" element={<GuestOnly><LoginPage /></GuestOnly>} />
                <Route path="/my-account" element={<RequireAuth><p>account</p></RequireAuth>} />
                <Route path="/p-admin" element={<RequireRole role="ADMIN"><p>admin</p></RequireRole>} />
            </Routes>
        </MemoryRouter>
    </AuthContext.Provider>
)

const authState = (status: AuthStatus, role?: Role): AuthContextValue => {
    const user = role ? ({ role } as User) : null
    return {
        token: role ? "token" : null,
        user,
        status,
        isLoading: status === "loading",
        isLoggedIn: status === "authenticated",
        isAdmin: role === "ADMIN",
        login: () => { },
        logout: () => { },
        refreshUser: async () => user,
        userInfo: user ?? {},
    }
}

const guest = authState("guest")
const loading = authState("loading")
const user = authState("authenticated", "USER")
const admin = authState("authenticated", "ADMIN")

test("guest is sent to /login, remembering where they were going", () => {
    renderAt("/p-admin", guest)
    expect(screen.getByText("login page (from /p-admin)")).toBeInTheDocument()
})

test("while the session is resolving, protected pages wait instead of redirecting", () => {
    renderAt("/p-admin", loading)
    expect(screen.getByRole("status")).toBeInTheDocument()
    expect(screen.queryByText(/login page/)).not.toBeInTheDocument()
})

test("a normal user cannot open the admin panel", () => {
    renderAt("/p-admin", user)
    expect(screen.getByText("home")).toBeInTheDocument()
})

test("admin can open the admin panel; any user can open their account", () => {
    renderAt("/p-admin", admin)
    expect(screen.getByText("admin")).toBeInTheDocument()
})

test("RequireAuth lets a logged-in user through", () => {
    renderAt("/my-account", user)
    expect(screen.getByText("account")).toBeInTheDocument()
})

test("logged-in user on /login is sent back to the page they came from", () => {
    render(
        <AuthContext.Provider value={admin}>
            <MemoryRouter initialEntries={[{ pathname: "/login", state: { from: { pathname: "/p-admin" } } }]}>
                <Routes>
                    <Route path="/login" element={<GuestOnly><LoginPage /></GuestOnly>} />
                    <Route path="/p-admin" element={<p>admin</p>} />
                </Routes>
            </MemoryRouter>
        </AuthContext.Provider>
    )
    expect(screen.getByText("admin")).toBeInTheDocument()
})
