import { Link } from 'react-router-dom'

/*
 * Shared button. Renders a router <Link> (to), an <a> (href) or a <button>.
 * Pass Bootstrap classes through className, e.g. "btn btn-primary".
 */
export default function Button(props) {
    const { to, className = "", href, disabled, actionForm, type = "button", ariaLabel } = props

    if (to) {
        return (
            <Link to={to} className={className} aria-label={ariaLabel}>
                {props.children}
            </Link>
        )
    }

    if (href) {
        return (
            <a href={href} className={className} aria-label={ariaLabel}>
                {props.children}
            </a>
        )
    }

    return (
        <button
            type={type}
            className={className}
            disabled={disabled}
            onClick={actionForm}
            aria-label={ariaLabel}>
            {props.children}
        </button>
    )
}
