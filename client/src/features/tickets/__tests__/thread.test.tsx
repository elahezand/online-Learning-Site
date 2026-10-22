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

test("admin and student both reply through the messages endpoint", async () => {
    mock.onPost("/tickets/t1/messages").reply(201, {})
    const admin = renderHook(() => useSendTicketMessage("t1", true), { wrapper: wrapper() })
    await act(() => admin.result.current.mutateAsync("Here is the fix"))
    const student = renderHook(() => useSendTicketMessage("t1", false), { wrapper: wrapper() })
    await act(() => student.result.current.mutateAsync("Thanks, it works"))
    expect(mock.history.post.map(r => [r.url, JSON.parse(r.data).body])).toEqual([
        ["/tickets/t1/messages", "Here is the fix"],
        ["/tickets/t1/messages", "Thanks, it works"],
    ])
})

test("a failed message is removed from the chat", async () => {
    const thread = { messages: [{ _id: "m1", body: "Hi", isAnswer: 0 }] }
    mock.onGet("/tickets/t1/messages").reply(200, thread)
    mock.onPost("/tickets/t1/messages").reply(500)
    const { result } = renderHook(() => ({ thread: useTicketThread("t1"), send: useSendTicketMessage("t1", false) }), { wrapper: wrapper() })
    await waitFor(() => expect(result.current.thread.data?.messages).toHaveLength(1))
    await act(() => result.current.send.mutateAsync("Lost").catch(() => { }))
    await waitFor(() => expect(result.current.thread.data?.messages).toHaveLength(1))
})

test("a reply stays new until the ticket is opened", () => {
    const ticket = { _id: "t1", answer: 1 as const, updatedAt: "2026-10-01T10:00:00.000Z" }
    expect(hasNewReply(ticket)).toBe(true)
    markTicketSeen(ticket)
    expect(hasNewReply(ticket)).toBe(false)
    expect(hasNewReply({ ...ticket, updatedAt: "2026-10-02T10:00:00.000Z" })).toBe(true)
    expect(hasNewReply({ ...ticket, answer: 0 })).toBe(false)
})
