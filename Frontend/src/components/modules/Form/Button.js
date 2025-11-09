import "./Button.css"
import { Link } from 'react-router-dom'

export default function Button(props) {
    const { to, className, href, disabled, actionForm } = props

    if (to) {
        return (
            <Link
                to={to}
                classNameّ={className}>
                {props.children}
            </Link>
        )
    } else if (href) {
        return (
            <a href={href}
                className={className}
            >
                {props.children}</a>
        )
    } else {
        return (
            <button
                className={className}
                disabled={disabled}
                onClick={actionForm}
            >
                {props.children}</button>
        )
    }


}
