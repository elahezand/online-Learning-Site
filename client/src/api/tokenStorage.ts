const ACCESS_KEY = "accessToken"
const REFRESH_KEY = "refreshToken"

const tokenStorage = {
    get(): string | null {
        try {
            return localStorage.getItem(ACCESS_KEY)
        } catch {
            return null
        }
    },
    getRefresh(): string | null {
        try {
            return localStorage.getItem(REFRESH_KEY)
        } catch {
            return null
        }
    },
    set(token: string, refreshToken?: string) {
        try {
            localStorage.setItem(ACCESS_KEY, token)
            if (refreshToken) localStorage.setItem(REFRESH_KEY, refreshToken)
        } catch {
            // storage unavailable (private mode): the session lives in memory only
        }
    },
    clear() {
        try {
            localStorage.removeItem(ACCESS_KEY)
            localStorage.removeItem(REFRESH_KEY)
        } catch {
            // nothing to clear
        }
    },
}

export default tokenStorage
