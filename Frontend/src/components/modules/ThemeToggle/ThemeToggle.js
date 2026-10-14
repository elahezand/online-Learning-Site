import { BsMoonStarsFill, BsSunFill } from "react-icons/bs";
import useTheme from '../../../Hooks/useTheme';

export default function ThemeToggle({ onMedia = false, className = "" }) {
    const [theme, toggleTheme] = useTheme()
    const isDark = theme === "dark"

    return (
        <button
            type="button"
            className={`icon-btn ${onMedia ? "icon-btn--on-media" : ""} ${className}`}
            onClick={toggleTheme}
            aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
            title={isDark ? "Light theme" : "Dark theme"}>
            {isDark ? <BsSunFill /> : <BsMoonStarsFill />}
        </button>
    )
}
