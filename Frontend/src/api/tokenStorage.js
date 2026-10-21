const ACCESS_KEY = "accessToken"
const REFRESH_KEY = "refreshToken"

const tokenStorage = {
    get() {
        try {
            return localStorage.getItem(ACCESS_KEY)
        } catch {
            return null
        }
    },
    getRefresh() {
        try {
            return localStorage.getItem(REFRESH_KEY)
        } catch {
            return null
        }
    },
    set(token, refreshToken) {
        try {
            localStorage.setItem(ACCESS_KEY, token)
            if (refreshToken) localStorage.setItem(REFRESH_KEY, refreshToken)
        } catch { }
    },
    clear() {
        try {
            localStorage.removeItem(ACCESS_KEY)
            localStorage.removeItem(REFRESH_KEY)
        } catch { }
    },
}

export default tokenStorage