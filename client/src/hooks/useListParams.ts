import { useSearchParams } from "react-router-dom"

export default function useListParams() {
    const [searchParams, setSearchParams] = useSearchParams()

    const page = Math.max(1, Number(searchParams.get("page")) || 1)
    const get = (key: string) => searchParams.get(key) ?? ""

    const update = (changes: Record<string, string>) => setSearchParams(params => {
        for (const [key, value] of Object.entries(changes)) {
            if (value) params.set(key, value)
            else params.delete(key)
        }
        params.delete("page")
        return params
    }, { replace: true })

    return { page, get, update }
}