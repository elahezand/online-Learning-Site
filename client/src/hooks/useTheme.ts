import { useCallback, useSyncExternalStore } from "react"

/*
 * Light / dark theme, shared by every component.
 *
 * The theme lives on <html data-bs-theme="..."> (Bootstrap 5.3 color modes)
 * and the user's choice is remembered in localStorage. index.html
 * applies it before the first paint, so there is no flash.
 *
 * Until the user picks a theme, the site follows the OS setting.
 */

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

/* Keep the browser UI (mobile address bar) in the same color as the page */
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

// index.html sets the theme before React loads; match the browser UI to it
syncThemeColor(readTheme())

/* OS theme changed: follow it only if the user never picked one */
const onSystemChange = (e: MediaQueryListEvent) => {
    if (!readSaved()) applyTheme(e.matches ? "dark" : "light")
}

/* Theme changed in another tab */
const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) applyTheme(e.newValue === "dark" || e.newValue === "light" ? e.newValue : systemDark?.matches ? "dark" : "light")
}

/*
 * The window listeners are added once, when the first component subscribes,
 * and removed when the last one unsubscribes, no matter how many components
 * use the hook.
 */
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

/* Read a CSS variable from the page, e.g. getToken("--bs-body-bg") */
export const getToken = (name: string) => getComputedStyle(root).getPropertyValue(name).trim()
