import { QueryClient } from "@tanstack/react-query"

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 60 * 1000,
            retry: (failureCount, error) => {
                const status = error?.response?.status
                return failureCount < 1 && !(status >= 400 && status < 500)
            },
        },
    },
})

export default queryClient