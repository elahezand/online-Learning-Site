import { createContext, useCallback, useEffect, useMemo, useState } from "react"
import type { ReactNode } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { api } from "../../api/client"
import tokenStorage from "../../api/tokenStorage"
import type { User } from "../../types/models"

export type AuthStatus = "loading" | "authenticated" | "guest"

export interface AuthContextValue {
    user: User | null
    userInfo: Partial<User>
    status: AuthStatus
    isLoggedIn: boolean
    logout: () => Promise<void>
    refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [status, setStatus] = useState<AuthStatus>(() => (tokenStorage.get() ? "loading" : "guest"))
    const queryClient = useQueryClient()

    const clearSession = useCallback(() => {
        tokenStorage.clear()
        setUser(null)
        setStatus("guest")
        queryClient.resetQueries()
    }, [queryClient])


    const refreshUser = useCallback(async () => {
        if (!tokenStorage.get()) return clearSession()
        try {
            const { data } = await api.get<User>("/auth/me", { silentAuth: true })
            setUser(data)
            setStatus("authenticated")
        } catch {
            clearSession()
        }
    }, [clearSession])

    useEffect(() => {
        refreshUser()
    }, [refreshUser])

    const logout = useCallback(async () => {
        const refreshToken = tokenStorage.getRefresh()
        if (refreshToken) {
            await api.post("/auth/logout", { refreshToken }, { skipRefresh: true }).catch(() => { })
        }
        clearSession()
    }, [clearSession])

    const value = useMemo<AuthContextValue>(() => ({
        user,
        userInfo: user ?? {},
        status,
        isLoggedIn: status === "authenticated",
        logout,
        refreshUser,
    }), [user, status, logout, refreshUser])

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default AuthContext