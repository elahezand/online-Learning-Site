import type { CSSProperties, ReactNode } from "react"
import { BrowserRouter } from "react-router-dom"
import { QueryClientProvider } from "@tanstack/react-query"
import { Toaster } from "sonner"
import queryClient from "../api/queryClient"
import { AuthProvider } from "../features/auth/AuthContext"
import useTheme from "../hooks/useTheme"
import { DIALOG_TOASTER } from "../components/ui/toastConfig"

const STATUS_WIDTH = { "--width": "400px" } as CSSProperties
const DIALOG_WIDTH = { "--width": "min(480px, calc(100vw - 32px))" } as CSSProperties

export default function AppProviders({ children }: { children: ReactNode }) {
    const [theme] = useTheme()

    return (
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <AuthProvider>
                    {children}
                    <Toaster richColors closeButton position="top-center" theme={theme} visibleToasts={4}
                        offset={{ top: 80 }} style={STATUS_WIDTH} toastOptions={{ className: "app-toast" }} />
                    <Toaster id={DIALOG_TOASTER} className="dialog-toaster" position="top-center" theme={theme} visibleToasts={1}
                        offset={{ top: "22vh" }} mobileOffset={{ top: "16vh", left: 16, right: 16 }} style={DIALOG_WIDTH} />
                </AuthProvider>
            </BrowserRouter>
        </QueryClientProvider>
    )
}
