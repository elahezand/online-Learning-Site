import { useEffect } from "react"
import { useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom"

const toPositiveInt = (value, fallback) => {
    const number = Number.parseInt(value, 10)
    return Number.isInteger(number) && number > 0 ? number : fallback
}

export default function usePagination(items = [], { limit: defaultLimit = 10, maxLimit = 50 } = {}) {
    const [searchParams] = useSearchParams()
    const { page: legacyPage } = useParams()
    const { pathname, search } = useLocation()
    const navigate = useNavigate()

    useEffect(() => {
        if (!legacyPage) return
        const params = new URLSearchParams(search)
        if (!params.has("page")) params.set("page", legacyPage)
        const base = pathname.replace(/\/$/, "")
        navigate({ pathname: base.slice(0, base.length - legacyPage.length - 1), search: params.toString() }, { replace: true })
    }, [legacyPage, pathname, search, navigate])

    const limit = Math.min(toPositiveInt(searchParams.get("limit"), defaultLimit), maxLimit)
    const pageCount = Math.max(1, Math.ceil(items.length / limit))
    const page = Math.min(toPositiveInt(searchParams.get("page"), 1), pageCount)
    const start = (page - 1) * limit

    return { page, limit, pageCount, start, pageItems: items.slice(start, start + limit) }
}
