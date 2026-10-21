export default function PageLoader({ fullPage = false }: { fullPage?: boolean }) {
    return (
        <div className={`d-flex justify-content-center align-items-center py-5 ${fullPage ? "min-vh-100" : ""}`} role="status">
            <div className="spinner-border text-primary" aria-hidden="true"></div>
            <span className="visually-hidden">Loading…</span>
        </div>
    )
}
