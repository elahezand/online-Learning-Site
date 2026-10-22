import type { ReactNode } from "react"
import { act, renderHook, waitFor } from "@testing-library/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import MockAdapter from "axios-mock-adapter"
import { api } from "../../../api/client"
import { useSendTicketMessage, useTicketThread } from "../hooks"
import { hasNewReply, markTicketSeen } from "../ticketView"

let mock: MockAdapter

const wrapper = () => {
    const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
    return ({ children }: { children: ReactNode }) => <QueryClientProvider client={client}>{children}</QueryClientProvider>
}

beforeEach(() => {
    mock = new MockAdapter(api)
    localStorage.clear()
})
afterEach(() => mock.restore())

test("reads the full conversation when the backend supports it", async () => {
    mock.onGet("/tickets/t1/messages").reply(200, {
        ticket: { _id: "t1", title: "Help", answer: 1 },
        messages: [{ _id: "m1", body: "Hi", isAnswer: 0 }, { _id: "m2", body: "Hello!", isAnswer: 1 }, { _id: "m3", body: "Thanks", isAnswer: 0 }],
    })
    const { result } = renderHook(() => useTicketThread("t1"), { wrapper: wrapper() })
    await waitFor(() => expect(result.current.data?.messages).toHaveLength(3))
    expect(result.current.data?.ticket?.title).toBe("Help")
})

test("falls back to the question and answer endpoint", async () => {
    mock.onGet("/tickets/t1/messages").reply(404)
    mock.onGet("/tickets/answer/t1").reply(200, { ticket: "My question", answer: "Our answer" })
    const { result } = renderHook(() => useTicketThread("t1"), { wrapper: wrapper() })
    await waitFor(() => expect(result.current.data?.messages.map(m => [m.body, m.isAnswer])).toEqual([["My question", 0], ["Our answer", 1]]))
})

test("an admin reply falls back to POST /tickets/answer", async () => {
    mock.onGet("/tickets/t1/messages").reply(404)
    mock.onGet("/tickets/answer/t1").reply(200, { ticket: "Q", answer: null })
    mock.onPost("/tickets/t1/messages").reply(404)
    mock.onPost("/tickets/answer").reply(201, {})
    const { result } = renderHook(() => useSendTicketMessage("t1", true), { wrapper: wrapper() })
    await act(() => result.current.mutateAsync("Here is the fix"))
    expect(JSON.parse(mock.history.post.at(-1)!.data)).toEqual({ ticketID: "t1", body: "Here is the fix" })
})

test("a user reply needs the messages endpoint", async () => {
    mock.onPost("/tickets/t1/messages").reply(404)
    const { result } = renderHook(() => useSendTicketMessage("t1", false), { wrapper: wrapper() })
    await act(() => result.current.mutateAsync("Still broken").catch(() => { }))
    expect(mock.history.post.map(r => r.url)).toEqual(["/tickets/t1/messages"])
})

test("a reply stays new until the ticket is opened", () => {
    const ticket = { _id: "t1", answer: 1 as const, updatedAt: "2026-10-01T10:00:00.000Z" }
    expect(hasNewReply(ticket)).toBe(true)
    markTicketSeen(ticket)
    expect(hasNewReply(ticket)).toBe(false)
    expect(hasNewReply({ ...ticket, updatedAt: "2026-10-02T10:00:00.000Z" })).toBe(true)
    expect(hasNewReply({ ...ticket, answer: 0 })).toBe(false)
})
