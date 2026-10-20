import env from "../config/env"
import tokenStorage from "./tokenStorage"



export class ApiError extends Error {
    constructor(status, data, message) {
        super(message || `Request failed with status ${status}`)
        this.name = "ApiError"
        this.status = status
        this.data = data
    }
}

const unauthorizedListeners = new Set()

/* Subscribe to "the server rejected our token". Returns an unsubscribe fn. */
export const onUnauthorized = (listener) => {
    unauthorizedListeners.add(listener)
    return () => unauthorizedListeners.delete(listener)
}

const parseBody = async (res) => {
    if (res.status === 204) return null
    const text = await res.text()
    if (!text) return null
    const type = res.headers.get("content-type") || ""
    if (type.includes("application/json")) {
        try { return JSON.parse(text) } catch { return text }
    }
    return text
}

const messageFrom = (data) =>
    (data && typeof data === "object" && (data.message || data.error)) ||
    (typeof data === "string" && data) ||
    undefined

export async function request(path, { method = "GET", body, headers, signal, auth = true } = {}) {
    const token = auth ? tokenStorage.get() : null
    const isFormData = typeof FormData !== "undefined" && body instanceof FormData

    const finalHeaders = {
        Accept: "application/json",
        ...(body !== undefined && !isFormData ? { "Content-Type": "application/json" } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...headers,
    }

    let res
    try {
        res = await fetch(`${env.apiUrl}${path}`, {
            method,
            headers: finalHeaders,
            signal,
            body: body === undefined ? undefined : isFormData ? body : JSON.stringify(body),
        })
    } catch (err) {
        if (err.name === "AbortError") throw err
        throw new ApiError(0, null, "Network error: could not reach the server")
    }

    const data = await parseBody(res)

    if (!res.ok) {
        if (res.status === 401 && token) {
            unauthorizedListeners.forEach(listener => listener())
        }
        throw new ApiError(res.status, data, messageFrom(data))
    }

    return data
}

const api = {
    get: (path, options) => request(path, { ...options, method: "GET" }),
    post: (path, body, options) => request(path, { ...options, method: "POST", body }),
    put: (path, body, options) => request(path, { ...options, method: "PUT", body }),
    delete: (path, options) => request(path, { ...options, method: "DELETE" }),
}

/* Text to show the user for a failed request: the server's own message
   when it sent one, otherwise the fallback. */
export const errorMessage = (error, fallback = "Something went wrong, please try again") =>
    (error?.status === 0 && error.message) || messageFrom(error?.data) || fallback

/* True for errors we should ignore (component unmounted / request replaced) */
export const isAbortError = (err) => err?.name === "AbortError"

export default api
