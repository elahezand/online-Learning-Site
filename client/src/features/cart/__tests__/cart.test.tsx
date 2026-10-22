import { act, renderHook } from "@testing-library/react"
import useCart from "../useCart"

const react = { _id: "c1", name: "React", shortName: "react", price: 1000, discount: 20 }
const html = { _id: "c2", name: "HTML", shortName: "html", price: 500 }

beforeEach(() => localStorage.clear())

test("adds each course once and totals the discounted prices", () => {
    const { result } = renderHook(() => useCart())
    act(() => { result.current.add(react); result.current.add(html); result.current.add(react) })
    expect(result.current.count).toBe(2)
    expect(result.current.subtotal).toBe(1500)
    expect(result.current.savings).toBe(200)
    expect(result.current.total).toBe(1300)
    expect(result.current.has("c1")).toBe(true)
})

test("removes a course and keeps the cart after a reload", () => {
    const first = renderHook(() => useCart())
    act(() => { first.result.current.add(react); first.result.current.add(html) })
    act(() => first.result.current.remove("c1"))
    const second = renderHook(() => useCart())
    expect(second.result.current.items.map(item => item._id)).toEqual(["c2"])
})
