import { useCallback, useSyncExternalStore } from "react"


export type Theme = "light" | "dark"

const STORAGE_KEY = "theme"
const root = document.documentElement
const systemDark = window.matchMedia?.("(prefers-color-scheme: dark)")

const listeners = new Set<() => void>()

const readTheme = (): Theme => (root.getAttribute("data-bs-theme") === "dark" ? "dark" : "light")

const readSaved = () => {
    try {
        return localStorage.getItem(STORAGE_KEY)
    } catch {
        return null
    }
}

const syncThemeColor = (theme: Theme) => {
    const color = getComputedStyle(root).getPropertyValue("--bs-body-bg").trim()
    if (!color) return
    document.querySelectorAll('meta[name="theme-color"]').forEach((meta) => {
        meta.setAttribute("content", color)
        meta.removeAttribute("media")
    })
    root.style.colorScheme = theme
}

const applyTheme = (theme: Theme) => {
    if (readTheme() !== theme) root.setAttribute("data-bs-theme", theme)
    syncThemeColor(theme)
    listeners.forEach((listener) => listener())
}

syncThemeColor(readTheme())

const onSystemChange = (e: MediaQueryListEvent) => {
    if (!readSaved()) applyTheme(e.matches ? "dark" : "light")
}

const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) applyTheme(e.newValue === "dark" || e.newValue === "light" ? e.newValue : systemDark?.matches ? "dark" : "light")
}


const subscribe = (listener: () => void) => {
    if (listeners.size === 0) {
        systemDark?.addEventListener?.("change", onSystemChange)
        window.addEventListener("storage", onStorage)
    }
    listeners.add(listener)

    return () => {
        listeners.delete(listener)
        if (listeners.size === 0) {
            systemDark?.removeEventListener?.("change", onSystemChange)
            window.removeEventListener("storage", onStorage)
        }
    }
}

export const setTheme = (theme: Theme) => {
    try {
        localStorage.setItem(STORAGE_KEY, theme)
    } catch {
        /* storage unavailable: the theme still applies for this visit */
    }
    applyTheme(theme)
}

export default function useTheme(): [Theme, () => void] {
    const theme = useSyncExternalStore(subscribe, readTheme, (): Theme => "light")
    const toggleTheme = useCallback(() => setTheme(readTheme() === "dark" ? "light" : "dark"), [])
    return [theme, toggleTheme]
}

export const getToken = (name: string) => getComputedStyle(root).getPropertyValue(name).trim()
