import api, { ApiError, errorMessage, onUnauthorized } from "../client"
import tokenStorage from "../tokenStorage"

const jsonResponse = (status, body) => ({
    ok: status >= 200 && status < 300,
    status,
    headers: { get: () => "application/json; charset=utf-8" },
    text: () => Promise.resolve(body === undefined ? "" : JSON.stringify(body)),
})

beforeEach(() => {
    global.fetch = jest.fn()
    localStorage.clear()
})

test("prefixes the base URL and returns parsed JSON", async () => {
    fetch.mockResolvedValue(jsonResponse(200, [{ id: 1 }]))
    await expect(api.get("/courses")).resolves.toEqual([{ id: 1 }])
    expect(fetch.mock.calls[0][0]).toBe("http://localhost:4000/v1/courses")
})

test("attaches the stored token, and omits it when auth is false", async () => {
    tokenStorage.set("abc")
    fetch.mockResolvedValue(jsonResponse(200, {}))

    await api.get("/users")
    expect(fetch.mock.calls[0][1].headers.Authorization).toBe("Bearer abc")

    await api.post("/auth/login", { identifier: "a" }, { auth: false })
    expect(fetch.mock.calls[1][1].headers.Authorization).toBeUndefined()
})

test("sends objects as JSON and FormData untouched", async () => {
    fetch.mockResolvedValue(jsonResponse(201, {}))

    await api.post("/category", { name: "js" })
    const [, jsonInit] = fetch.mock.calls[0]
    expect(jsonInit.headers["Content-Type"]).toBe("application/json")
    expect(jsonInit.body).toBe('{"name":"js"}')

    const form = new FormData()
    await api.post("/courses", form)
    const [, formInit] = fetch.mock.calls[1]
    expect(formInit.headers["Content-Type"]).toBeUndefined() // browser sets the boundary
    expect(formInit.body).toBe(form)
})

test("throws ApiError with the server message on non-2xx", async () => {
    fetch.mockResolvedValue(jsonResponse(409, { message: "Username is taken" }))
    const error = await api.post("/auth/register", {}).catch(e => e)
    expect(error).toBeInstanceOf(ApiError)
    expect(error.status).toBe(409)
    expect(errorMessage(error, "fallback")).toBe("Username is taken")
})

test("uses the fallback message when the server sent none", async () => {
    fetch.mockResolvedValue(jsonResponse(500))
    const error = await api.get("/x").catch(e => e)
    expect(errorMessage(error, "fallback")).toBe("fallback")
})

test("reports a network failure as status 0", async () => {
    fetch.mockRejectedValue(new TypeError("Failed to fetch"))
    const error = await api.get("/x").catch(e => e)
    expect(error.status).toBe(0)
    expect(errorMessage(error)).toMatch(/could not reach the server/)
})

test("401 with a token notifies listeners; 401 without one does not", async () => {
    const listener = jest.fn()
    const unsubscribe = onUnauthorized(listener)
    fetch.mockResolvedValue(jsonResponse(401, { message: "expired" }))

    await api.get("/auth/me").catch(() => { })
    expect(listener).not.toHaveBeenCalled()

    tokenStorage.set("old")
    await api.get("/auth/me").catch(() => { })
    expect(listener).toHaveBeenCalledTimes(1)
    unsubscribe()
})
