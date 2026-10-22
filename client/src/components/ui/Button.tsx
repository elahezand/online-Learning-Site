import type { MouseEventHandler, ReactNode } from "react"
import { Link } from "react-router-dom"

interface ButtonProps {
    to?: string
    href?: string
    className?: string
    disabled?: boolean
    actionForm?: MouseEventHandler<HTMLButtonElement>
    type?: "button" | "submit" | "reset"
    ariaLabel?: string
    children: ReactNode
}

export default function Button({ to, className = "", href, disabled, actionForm, type = "button", ariaLabel, children }: ButtonProps) {
    if (to) {
        return <Link to={to} className={className} aria-label={ariaLabel}>{children}</Link>
    }

    if (href) {
        return <a href={href} className={className} aria-label={ariaLabel}>{children}</a>
    }

    return (
        <button type={type} className={className} disabled={disabled} onClick={actionForm} aria-label={ariaLabel}>
            {children}
        </button>
    )
}
