import { createContext, useCallback, useEffect, useMemo, useState } from "react"
import type { ReactNode } from "react"
import { useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import { api } from "../../api/client"
import tokenStorage from "../../api/tokenStorage"
import type { User } from "../../types/models"

export type AuthStatus = "loading" | "authenticated" | "guest"

export interface AuthContextValue {
    token: string | null
    user: User | null
    status: AuthStatus
    isLoading: boolean
    isLoggedIn: boolean
    isAdmin: boolean
    login: (token: string, refreshToken?: string) => void
    logout: () => void
    refreshUser: (signal?: AbortSignal) => Promise<User | null>
    userInfo: Partial<User>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
    const [token, setToken] = useState(() => tokenStorage.get())
    const [user, setUser] = useState<User | null>(null)
    const [status, setStatus] = useState<AuthStatus>(() => (tokenStorage.get() ? "loading" : "guest"))
    const queryClient = useQueryClient()


    const clearSession = useCallback(() => {
        queryClient.clear()
        tokenStorage.clear()
        setToken(null)
        setUser(null)
        setStatus("guest")
    }, [queryClient])

    const refreshUser = useCallback(async (signal?: AbortSignal) => {
        if (!tokenStorage.get()) {
            clearSession()
            return null
        }
        try {
            const { data: me } = await api.get<User>("/auth/me", { signal, silentAuth: true })
            setUser(me)
            setStatus("authenticated")
            return me
        } catch (err) {
            if (axios.isCancel(err)) return null
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
        const onStorage = (e: StorageEvent) => {
            if (e.key === null || e.key === "accessToken") {
                const next = tokenStorage.get()
                if (next) setToken(next)
                else clearSession()
            }
        }
        window.addEventListener("storage", onStorage)
        return () => window.removeEventListener("storage", onStorage)
    }, [clearSession])

    const login = useCallback((newToken: string, refreshToken?: string) => {
        queryClient.clear()
        tokenStorage.set(newToken, refreshToken)
        setToken(newToken)
    }, [queryClient])

    const value = useMemo<AuthContextValue>(() => ({
        token,
        user,
        status,
        isLoading: status === "loading",
        isLoggedIn: status === "authenticated",
        isAdmin: user?.role === "ADMIN",
        login,
        logout: clearSession,
        refreshUser,
        userInfo: user ?? {},
    }), [token, user, status, login, clearSession, refreshUser])

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default AuthContext
