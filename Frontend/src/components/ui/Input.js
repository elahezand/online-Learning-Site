export default function Input({ as: Tag = "input", error, className = "", children, ...props }) {
    const base = Tag === "select" ? "form-select" : "form-control"

    return (
        <>
            <Tag className={`${base} ${error ? "is-invalid" : ""} ${className}`} aria-invalid={Boolean(error)} {...props}>
                {children}
            </Tag>
            {error && <div className="invalid-feedback">{error}</div>}
        </>
    )
}
