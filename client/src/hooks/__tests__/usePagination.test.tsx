import { render, screen } from "@testing-library/react"
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom"
import usePagination from "../usePagination"

const items = Array.from({ length: 23 }, (_, i) => i + 1)

function List() {
    const { page, pageCount, pageItems, limit } = usePagination(items)
    const { pathname, search } = useLocation()
    return <p data-testid="out">{`${pathname}${search}|${page}/${pageCount}|${limit}|${pageItems.join(",")}`}</p>
}

const renderAt = (url: string) => render(
    <MemoryRouter initialEntries={[url]}>
        <Routes><Route path="/users/:page?" element={<List />} /></Routes>
    </MemoryRouter>
)

const out = () => screen.getByTestId("out").textContent

test("defaults to page 1 with 10 items", () => {
    renderAt("/users")
    expect(out()).toBe("/users|1/3|10|1,2,3,4,5,6,7,8,9,10")
})

test("reads page and limit from the query string", () => {
    renderAt("/users?page=2&limit=5")
    expect(out()).toBe("/users?page=2&limit=5|2/5|5|6,7,8,9,10")
})

test("clamps out-of-range and invalid values", () => {
    renderAt("/users?page=99&limit=abc")
    expect(out()).toBe("/users?page=99&limit=abc|3/3|10|21,22,23")
})

test("redirects the old /users/2 links to ?page=2", async () => {
    renderAt("/users/2")
    expect(await screen.findByText(/^\/users\?page=2\|2\/3/)).toBeInTheDocument()
})
