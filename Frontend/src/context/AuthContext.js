import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { authApi, onUnauthorized, tokenStorage } from "../api"

/*
 * Auth state for the whole app.
 *
 * status:
 *   "loading"        – we have a token and are asking the server who we are
 *   "authenticated"  – user is known
 *   "guest"          – no token, or the token was rejected
 *
 * Guards must wait while status is "loading", otherwise a logged-in
 * admin who refreshes /p-admin would be bounced to /login.
 */

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
    const [token, setToken] = useState(() => tokenStorage.get())
    const [user, setUser] = useState(null)
    const [status, setStatus] = useState(() => (tokenStorage.get() ? "loading" : "guest"))
    const queryClient = useQueryClient()

    // Cached server data can be user-specific ("my courses", "is registered"),
    // so it is dropped whenever the session changes.
    const clearSession = useCallback(() => {
        queryClient.clear()
        tokenStorage.clear()
        setToken(null)
        setUser(null)
        setStatus("guest")
    }, [queryClient])

    const refreshUser = useCallback(async (signal) => {
        if (!tokenStorage.get()) {
            clearSession()
            return null
        }
        try {
            const me = await authApi.me({ signal })
            setUser(me)
            setStatus("authenticated")
            return me
        } catch (err) {
            if (err.name === "AbortError") return null
            // 401 is handled by onUnauthorized. Any other failure (server down)
            // must not leave the guards waiting forever.
            if (err.status !== 401) setStatus(prev => (prev === "loading" ? "guest" : prev))
            return null
        }
    }, [clearSession])

    // Resolve the session whenever the token changes
    useEffect(() => {
        if (!token) return
        const controller = new AbortController()
        setStatus("loading")
        refreshUser(controller.signal)
        return () => controller.abort()
    }, [token, refreshUser])

    // Server rejected the token (expired / revoked) → log out everywhere
    useEffect(() => onUnauthorized(clearSession), [clearSession])

    // Logging in/out in another tab updates this tab too
    useEffect(() => {
        const onStorage = (e) => {
            if (e.key === null || e.key === "userData") {
                const next = tokenStorage.get()
                if (next) setToken(next)
                else clearSession()
            }
        }
        window.addEventListener("storage", onStorage)
        return () => window.removeEventListener("storage", onStorage)
    }, [clearSession])

    const login = useCallback((newToken) => {
        queryClient.clear()
        tokenStorage.set(newToken)
        setToken(newToken)
    }, [queryClient])

    const value = useMemo(() => ({
        token,
        user,
        status,
        isLoading: status === "loading",
        isLoggedIn: status === "authenticated",
        isAdmin: user?.role === "ADMIN",
        login,
        logout: clearSession,
        refreshUser,
        // Backwards-compatible alias used by existing components
        userInfo: user ?? {},
    }), [token, user, status, login, clearSession, refreshUser])

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
    const ctx = useContext(AuthContext)
    if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>")
    return ctx
}

export default AuthContext
