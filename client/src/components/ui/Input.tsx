import type { ComponentPropsWithRef, ReactNode } from "react"

type InputProps =
    | ({ as?: "input" } & ComponentPropsWithRef<"input">)
    | ({ as: "textarea" } & ComponentPropsWithRef<"textarea">)
    | ({ as: "select"; children?: ReactNode } & ComponentPropsWithRef<"select">)

type Props = InputProps & { error?: string }

export default function Input({ error, className = "", ...rest }: Props) {
    const state = error ? "is-invalid" : ""
    const feedback = error && <div className="invalid-feedback">{error}</div>

    if (rest.as === "textarea") {
        const { as: _as, ...props } = rest
        return <><textarea className={`form-control ${state} ${className}`} aria-invalid={Boolean(error)} {...props} />{feedback}</>
    }
    if (rest.as === "select") {
        const { as: _as, ...props } = rest
        return <><select className={`form-select ${state} ${className}`} aria-invalid={Boolean(error)} {...props} />{feedback}</>
    }
    const { as: _as, ...props } = rest
    return <><input className={`form-control ${state} ${className}`} aria-invalid={Boolean(error)} {...props} />{feedback}</>
}
