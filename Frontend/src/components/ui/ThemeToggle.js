import { BsMoonStarsFill, BsSunFill } from "react-icons/bs"
import useTheme from "../../hooks/useTheme"

/* Square icon button that switches light / dark. Pass Bootstrap button
   classes through `className` (default: outline on the page background). */
export default function ThemeToggle({ className = "btn-outline-secondary" }) {
    const [theme, toggleTheme] = useTheme()
    const isDark = theme === "dark"

    return (
        <button
            type="button"
            className={`btn ${className} d-inline-flex align-items-center justify-content-center p-2 lh-1`}
            onClick={toggleTheme}
            aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
            title={isDark ? "Light theme" : "Dark theme"}>
            {isDark ? <BsSunFill /> : <BsMoonStarsFill />}
        </button>
    )
}
