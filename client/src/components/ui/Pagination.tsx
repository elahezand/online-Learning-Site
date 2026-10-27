import type { ReactNode } from "react"
import { Link, useLocation } from "react-router-dom"
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6"
import type { Pagination as PaginationInfo } from "../../types/models"

const pageNumbers = (page: number, pages: number): (number | string)[] => {
    const numbers = new Set([1, pages, page - 1, page, page + 1])
    const sorted = [...numbers].filter(n => n >= 1 && n <= pages).sort((a, b) => a - b)
    return sorted.flatMap((n, i) => (i > 0 && n - sorted[i - 1] > 1 ? ["gap-" + n, n] : [n]))
}

export default function Pagination({ pagination }: { pagination?: PaginationInfo }) {
    const { pathname, search } = useLocation()
    if (!pagination || pagination.pages <= 1) return null

    const { page, pages, hasPrev, hasNext } = pagination

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
                <PageLink target={page - 1} disabled={!hasPrev} label="Previous page"><FaChevronLeft /></PageLink>
                {pageNumbers(page, pages).map(item => typeof item === "string" ?
                    <li key={item} className="page-item disabled"><span className="page-link rounded border-0 bg-transparent">…</span></li> :
                    <li key={item} className={`page-item ${item === page ? "active" : ""}`}>
                        <Link to={linkTo(item)} className="page-link rounded" aria-current={item === page ? "page" : undefined}>{item}</Link>
                    </li>)}
                <PageLink target={page + 1} disabled={!hasNext} label="Next page"><FaChevronRight /></PageLink>
            </ul>
        </nav>
    )
}