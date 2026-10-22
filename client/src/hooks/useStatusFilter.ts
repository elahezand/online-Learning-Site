import { useMemo } from "react"
import useQueryParam from "./useQueryParam"

export interface StatusOption<T> {
    value: string
    label: string
    test: (item: T) => boolean
}

export const ALL = { value: "all", label: "All", test: () => true } as const


export default function useStatusFilter<T>(items: T[], options: readonly StatusOption<T>[]) {
    const [param, setParam] = useQueryParam("status")
    const current = options.find(option => option.value === param) ?? options[0]

    const counts = useMemo(() => Object.fromEntries(
        options.map(option => [option.value, items.filter(option.test).length])), [items, options])

    const filtered = useMemo(() => items.filter(current.test), [items, current])

    const setStatus = (value: string) => setParam(value === options[0].value ? "" : value)

    return { status: current.value, setStatus, counts, filtered }
}
