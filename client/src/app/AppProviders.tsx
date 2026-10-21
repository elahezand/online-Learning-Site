import type { ReactNode } from "react"
import { BrowserRouter } from "react-router-dom"
import { QueryClientProvider } from "@tanstack/react-query"
import { Toaster } from "sonner"
import queryClient from "../api/queryClient"
import { AuthProvider } from "../features/auth/AuthContext"
import useTheme from "../hooks/useTheme"

export default function AppProviders({ children }: { children: ReactNode }) {
    const [theme] = useTheme()

    return (
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <AuthProvider>
                    {children}
                    <Toaster richColors position="top-center" theme={theme} visibleToasts={4} />
                </AuthProvider>
            </BrowserRouter>
        </QueryClientProvider>
    )
}
