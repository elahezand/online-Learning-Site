import { useSyncExternalStore, useCallback } from 'react'

/*
 * Light / dark theme, shared by every component.
 * The value lives on <html data-bs-theme="..."> (Bootstrap 5.3 color modes)
 * and is remembered in localStorage. public/index.html applies it before
 * the first paint so there is no flash.
 */

const STORAGE_KEY = "theme"
const listeners = new Set()

const readTheme = () =>
    document.documentElement.getAttribute("data-bs-theme") === "dark" ? "dark" : "light"

const notify = () => listeners.forEach(listener => listener())

export const setTheme = (theme) => {
    document.documentElement.setAttribute("data-bs-theme", theme)
    try {
        localStorage.setItem(STORAGE_KEY, theme)
    } catch (e) { /* storage unavailable: theme still applies for this visit */ }
    notify()
}

const subscribe = (listener) => {
    listeners.add(listener)

    // Follow the OS setting until the user picks a theme themselves
    const media = window.matchMedia ? window.matchMedia("(prefers-color-scheme: dark)") : null
    const onSystemChange = (e) => {
        let saved = null
        try { saved = localStorage.getItem(STORAGE_KEY) } catch (err) { }
        if (!saved) {
            document.documentElement.setAttribute("data-bs-theme", e.matches ? "dark" : "light")
            notify()
        }
    }
    media?.addEventListener?.("change", onSystemChange)

    return () => {
        listeners.delete(listener)
        media?.removeEventListener?.("change", onSystemChange)
    }
}

export default function useTheme() {
    const theme = useSyncExternalStore(subscribe, readTheme, () => "light")
    const toggleTheme = useCallback(
        () => setTheme(readTheme() === "dark" ? "light" : "dark"), [])
    return [theme, toggleTheme]
}

/* Read a token from theme.css, e.g. getToken("--color-primary") */
export const getToken = (name) =>
    getComputedStyle(document.documentElement).getPropertyValue(name).trim()
