import { QueryClient } from "@tanstack/react-query"
import type { ApiError } from "../types/api"

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 60 * 1000,
            retry: (failureCount, error) => {
                const status = (error as ApiError)?.response?.status ?? 0
                return failureCount < 1 && !(status >= 400 && status < 500)
            },
        },
    },
})

export default queryClient
