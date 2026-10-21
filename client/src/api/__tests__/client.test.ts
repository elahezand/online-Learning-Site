import MockAdapter from "axios-mock-adapter"
import { vi } from "vitest"
import { toast } from "sonner"
import { api } from "../client"
import type { ApiError } from "../../types/api"

vi.mock("sonner", () => ({ toast: { error: vi.fn() } }))

let mock: MockAdapter

beforeEach(() => {
    mock = new MockAdapter(api)
    localStorage.clear()
    vi.mocked(toast.error).mockClear()
})

afterEach(() => mock.restore())

const setTokens = (access: string, refresh?: string) => {
    localStorage.setItem("accessToken", access)
    if (refresh) localStorage.setItem("refreshToken", refresh)
}

test("sends the token from localStorage", async () => {
    setTokens("abc")
    mock.onGet("/courses").reply(200, [{ id: 1 }])

    const res = await api.get("/courses")
    expect(res.data).toEqual([{ id: 1 }])
    expect(mock.history.get[0].headers?.Authorization).toBe("Bearer abc")
})

test("no token → no Authorization header", async () => {
    mock.onGet("/courses").reply(200, [])

    await api.get("/courses")
    expect(mock.history.get[0].headers?.Authorization).toBeUndefined()
})

test("401 → refresh → saves new tokens → retries with the new token", async () => {
    setTokens("old", "r1")
    mock.onGet("/users").replyOnce(401).onGet("/users").replyOnce(200, ["ok"])
    mock.onPost("/auth/refresh").reply(200, { accessToken: "new", refreshToken: "r2" })

    const res = await api.get("/users")
    expect(res.data).toEqual(["ok"])
    expect(JSON.parse(mock.history.post[0].data)).toEqual({ refreshToken: "r1" })
    expect(mock.history.get[1].headers?.Authorization).toBe("Bearer new")
    expect(localStorage.getItem("accessToken")).toBe("new")
    expect(localStorage.getItem("refreshToken")).toBe("r2")
})

test("several 401s at once share a single refresh", async () => {
    setTokens("old", "r1")
    mock.onGet("/a").replyOnce(401).onGet("/a").reply(200, "a")
    mock.onGet("/b").replyOnce(401).onGet("/b").reply(200, "b")
    mock.onPost("/auth/refresh").reply(200, { accessToken: "new" })

    const [a, b] = await Promise.all([api.get("/a"), api.get("/b")])
    expect([a.data, b.data]).toEqual(["a", "b"])
    expect(mock.history.post).toHaveLength(1)
})

test("refresh fails → tokens cleared, one toast", async () => {
    setTokens("old", "r1")
    mock.onGet("/x").reply(401)
    mock.onPost("/auth/refresh").reply(401)

    const error = await api.get("/x").then(() => null, (e: ApiError) => e)

    expect(error?._authToastShown).toBe(true)
    expect(localStorage.getItem("accessToken")).toBeNull()
    expect(localStorage.getItem("refreshToken")).toBeNull()
    expect(toast.error).toHaveBeenCalledWith("Please LogIn", { id: "auth" })
})

test("silentAuth: no toast when the session is over", async () => {
    setTokens("old", "r1")
    mock.onGet("/auth/me").reply(401)
    mock.onPost("/auth/refresh").reply(401)

    await expect(api.get("/auth/me", { silentAuth: true })).rejects.toBeTruthy()
    expect(toast.error).not.toHaveBeenCalled()
})

test("skipRefresh: a wrong password does not trigger a refresh", async () => {
    mock.onPost("/auth/login").reply(401, { message: "wrong password" })

    await expect(api.post("/auth/login", {}, { skipRefresh: true })).rejects.toBeTruthy()
    expect(mock.history.post.filter(r => r.url === "/auth/refresh")).toHaveLength(0)
})
