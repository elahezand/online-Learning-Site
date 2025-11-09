import React from 'react'
import "./Input.css"

export default function Input(props) {

    const {value, type, isValid, className, placeholder, onChangeInput } = props

    return (
        <>

            {type === "input" ?
                <input
                    className={`${className} ${isValid ? "success" : "error"}`}
                    placeholder={placeholder}
                    onChange={onChangeInput}
                    value={value}

                />
                : <textarea
                    className={`${className} ${isValid ? "success" : "error"}`}
                    onChange={onChangeInput}
                    placeholder={placeholder}
                    value={value}
                />}
        </>
    )
}




