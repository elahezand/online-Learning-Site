import { useSearchParams } from "react-router-dom"

export default function useQueryParam(key: string): [string, (value: string, also?: Record<string, string>) => void] {
    const [searchParams, setSearchParams] = useSearchParams()

    const setValue = (value: string, also: Record<string, string> = {}) => setSearchParams(previous => {
        const next = new URLSearchParams(previous)
        next.delete("page")
        for (const [name, v] of Object.entries({ [key]: value, ...also })) {
            if (v) next.set(name, v)
            else next.delete(name)
        }
        return next
    })

    return [searchParams.get(key) ?? "", setValue]
}
