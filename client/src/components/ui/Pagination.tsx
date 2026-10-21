import type { ReactNode } from "react"
import { Link, useLocation } from "react-router-dom"
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6"

const pageNumbers = (page: number, pageCount: number): (number | string)[] => {
    const pages = new Set([1, pageCount, page - 1, page, page + 1])
    const sorted = [...pages].filter(n => n >= 1 && n <= pageCount).sort((a, b) => a - b)
    return sorted.flatMap((n, i) => (i > 0 && n - sorted[i - 1] > 1 ? ["gap-" + n, n] : [n]))
}

export default function Pagination({ page, pageCount }: { page: number; pageCount: number }) {
    const { pathname, search } = useLocation()
    if (pageCount <= 1) return null

    const linkTo = (target: number) => {
        const params = new URLSearchParams(search)
        if (target === 1) params.delete("page")
        else params.set("page", String(target))
        const query = params.toString()
        return query ? `${pathname}?${query}` : pathname
    }

    const PageLink = ({ target, disabled, label, children }: { target: number; disabled: boolean; label: string; children: ReactNode }) => (
        <li className={`page-item ${disabled ? "disabled" : ""}`}>
            {disabled ?
                <span className="page-link rounded" aria-hidden="true">{children}</span> :
                <Link to={linkTo(target)} className="page-link rounded" aria-label={label}>{children}</Link>}
        </li>
    )

    return (
        <nav aria-label="Pagination" className="my-4">
            <ul className="pagination justify-content-center flex-wrap gap-1 mb-0">
                <PageLink target={page - 1} disabled={page === 1} label="Previous page"><FaChevronLeft /></PageLink>
                {pageNumbers(page, pageCount).map(item => typeof item === "string" ?
                    <li key={item} className="page-item disabled"><span className="page-link rounded border-0 bg-transparent">…</span></li> :
                    <li key={item} className={`page-item ${item === page ? "active" : ""}`}>
                        <Link to={linkTo(item)} className="page-link rounded" aria-current={item === page ? "page" : undefined}>{item}</Link>
                    </li>)}
                <PageLink target={page + 1} disabled={page === pageCount} label="Next page"><FaChevronRight /></PageLink>
            </ul>
        </nav>
    )
}
