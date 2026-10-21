import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"
import { useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import { api } from "../../api/client"
import tokenStorage from "../../api/tokenStorage"

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
            // silentAuth: an expired session at startup is not an error to show
            const { data: me } = await api.get("/auth/me", { signal, silentAuth: true })
            setUser(me)
            setStatus("authenticated")
            return me
        } catch (err) {
            if (axios.isCancel(err)) return null
            // The client already tried a refresh. If it failed, the tokens are gone.
            if (!tokenStorage.get()) clearSession()
            else setStatus(prev => (prev === "loading" ? "guest" : prev))
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

    // Logging in/out in another tab updates this tab too
    useEffect(() => {
        const onStorage = (e) => {
            if (e.key === null || e.key === "accessToken") {
                const next = tokenStorage.get()
                if (next) setToken(next)
                else clearSession()
            }
        }
        window.addEventListener("storage", onStorage)
        return () => window.removeEventListener("storage", onStorage)
    }, [clearSession])

    const login = useCallback((newToken, refreshToken) => {
        queryClient.clear()
        tokenStorage.set(newToken, refreshToken)
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
