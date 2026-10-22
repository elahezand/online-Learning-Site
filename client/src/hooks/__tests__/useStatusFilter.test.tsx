import type { ReactNode } from "react"
import { act, renderHook } from "@testing-library/react"
import { MemoryRouter, useLocation } from "react-router-dom"
import useStatusFilter, { ALL } from "../useStatusFilter"
import type { StatusOption } from "../useStatusFilter"

type Item = { id: number; done: boolean }
const items: Item[] = [{ id: 1, done: false }, { id: 2, done: true }, { id: 3, done: false }]
const OPTIONS: readonly StatusOption<Item>[] = [
    ALL,
    { value: "open", label: "Open", test: item => !item.done },
    { value: "done", label: "Done", test: item => item.done },
]

const wrapper = (url: string) => ({ children }: { children: ReactNode }) =>
    <MemoryRouter initialEntries={[url]}>{children}</MemoryRouter>

const useFilterWithUrl = () => ({ filter: useStatusFilter(items, OPTIONS), location: useLocation() })

test("counts every status and filters by the one in the URL", () => {
    const { result } = renderHook(useFilterWithUrl, { wrapper: wrapper("/list?status=open") })
    expect(result.current.filter.counts).toEqual({ all: 3, open: 2, done: 1 })
    expect(result.current.filter.filtered.map(item => item.id)).toEqual([1, 3])
})

test("an unknown status falls back to all", () => {
    const { result } = renderHook(useFilterWithUrl, { wrapper: wrapper("/list?status=nope") })
    expect(result.current.filter.status).toBe("all")
    expect(result.current.filter.filtered).toHaveLength(3)
})

test("changing the filter keeps other params and goes back to page 1", () => {
    const { result } = renderHook(useFilterWithUrl, { wrapper: wrapper("/list?page=3&limit=5") })
    act(() => result.current.filter.setStatus("done"))
    expect(result.current.location.search).toBe("?limit=5&status=done")
    act(() => result.current.filter.setStatus("all"))
    expect(result.current.location.search).toBe("?limit=5")
})
