import { useState } from 'react'

/*
 * Bootstrap form field with live validation feedback.
 * type="input" renders an <input>, anything else renders a <textarea>.
 * inputType sets the native input type (text, password, email…).
 * Validation colors only appear after the user starts typing.
 */
export default function Input(props) {
    const { value, type, inputType = "text", isValid, className = "", placeholder, onChangeInput, rows = 5, id } = props
    const [touched, setTouched] = useState(false)

    const stateClass = touched ? (isValid ? "is-valid" : "is-invalid") : ""

    const handleChange = (e) => {
        setTouched(true)
        onChangeInput && onChangeInput(e)
    }

    return type === "input" ?
        <input
            id={id}
            type={inputType}
            className={`form-control ${stateClass} ${className}`}
            placeholder={placeholder}
            aria-label={placeholder}
            onChange={handleChange}
            value={value}
        />
        :
        <textarea
            id={id}
            rows={rows}
            className={`form-control ${stateClass} ${className}`}
            placeholder={placeholder}
            aria-label={placeholder}
            onChange={handleChange}
            value={value}
        />
}
