import { QueryClient } from "@tanstack/react-query"

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 60 * 1000,        
            refetchOnWindowFocus: false,
            retry: (failureCount, error) =>
                failureCount < 1 && !(error?.status >= 400 && error?.status < 500),
        },
    },
})

export default queryClient
