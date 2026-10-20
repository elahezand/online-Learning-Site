/*
 * The only place that knows where the access token is stored.
 * Kept under the same "userData" key the app used before, so people
 * who are already logged in stay logged in after this change.
 */
const STORAGE_KEY = "userData"

const tokenStorage = {
    get() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY)
            return raw ? JSON.parse(raw)?.token ?? null : null
        } catch {
            return null
        }
    },
    set(token) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify({ token }))
        } catch { /* storage unavailable: session-only login */ }
    },
    clear() {
        try {
            localStorage.removeItem(STORAGE_KEY)
        } catch { }
    },
}

export default tokenStorage
