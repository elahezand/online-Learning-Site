import { useEffect, useRef, useState } from "react"
import type { RefObject } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import DOMPurify from "dompurify"
import { toast } from "sonner"
import { FaArrowLeft, FaFacebookF, FaLink, FaRegCalendar, FaRegClock, FaTelegram, FaXTwitter } from "react-icons/fa6"
import ArticleSidebar from "./ArticleSidebar"
import { useArticle } from "./hooks"
import { useAuth } from "../auth/useAuth"
import { coverUrl } from "../../config/env"

const formatDate = (iso?: string) =>
    iso ? new Date(iso).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : ""

const readingMinutes = (html?: string) =>
    Math.max(1, Math.round((html ?? "").replace(/<[^>]*>/g, " ").split(/\s+/).filter(Boolean).length / 200))

function ReadingProgress({ target }: { target: RefObject<HTMLElement | null> }) {
    const [progress, setProgress] = useState(0)

    useEffect(() => {
        const update = () => {
            const el = target.current
            if (!el) return
            const { top, height } = el.getBoundingClientRect()
            const read = Math.min(Math.max(-top / Math.max(height - window.innerHeight, 1), 0), 1)
            setProgress(read)
        }
        update()
        window.addEventListener("scroll", update, { passive: true })
        window.addEventListener("resize", update)
        return () => {
            window.removeEventListener("scroll", update)
            window.removeEventListener("resize", update)
        }
    }, [target])

    return (
        <div className="reading-progress position-fixed top-0 start-0 w-100" aria-hidden="true">
            <div className="h-100 bg-primary" style={{ width: `${progress * 100}%` }} />
        </div>
    )
}

export default function ArticleDetail() {
    const { articleName } = useParams()
    const navigate = useNavigate()
    const articleRef = useRef<HTMLElement>(null)

    const { data: article, isLoading } = useArticle(articleName)
    const author = article?.creator?.name ?? article?.creator?.username ?? "ACADEMIA"
    const category = article?.categoryID

    const { status } = useAuth()
    useEffect(() => {
        if (status === "guest") navigate("/login", { state: { from: { pathname: `/article-info/${articleName}` } } })
    }, [status, navigate, articleName])

    const copyLink = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href)
            toast.success("Link copied")
        } catch {
            toast.error("Couldn't copy the link")
        }
    }

    return (
        <div className="container py-4 py-lg-5">
            <ReadingProgress target={articleRef} />
            <div className="row g-4 g-xl-5">
                <div className="col-12 col-lg-8">
                    <article ref={articleRef} className="card border-0 shadow-sm rounded-4 overflow-hidden">
                        {isLoading ?
                            <div className="card-body p-5 text-center"><div className="spinner-border text-primary" role="status"><span className="visually-hidden">Loading…</span></div></div> :
                            <div className="card-body p-3 p-sm-4 p-lg-5">
                                <header className="mb-4">
                                    {category?.title &&
                                        <Link to={`/category-info/${category.name}`} className="article-kicker d-inline-flex align-items-center gap-2 small fw-bold text-uppercase text-primary text-decoration-none mb-3">
                                            {category.title}
                                        </Link>}
                                    {article?.description &&
                                        <p className="lead text-body-secondary mb-4">{article.description}</p>}

                                    <div className="d-flex flex-wrap align-items-center gap-3 small text-body-secondary">
                                        <span className="d-inline-flex align-items-center gap-2">
                                            <span className="d-inline-flex align-items-center justify-content-center rounded-circle bg-primary-subtle text-primary-emphasis fw-bold"
                                                style={{ width: 36, height: 36 }} aria-hidden="true">
                                                {author.charAt(0).toUpperCase()}
                                            </span>
                                            <span className="fw-semibold text-body-emphasis">{author}</span>
                                        </span>
                                        {article?.createdAt &&
                                            <span className="d-inline-flex align-items-center gap-2"><FaRegCalendar /> {formatDate(article.createdAt)}</span>}
                                        <span className="d-inline-flex align-items-center gap-2"><FaRegClock /> {readingMinutes(article?.body)} min read</span>
                                    </div>
                                </header>

                                {article?.cover &&
                                    <div className="ratio ratio-16x9 rounded-4 overflow-hidden bg-body-secondary mb-4 mb-lg-5">
                                        <img src={coverUrl(article.cover)} alt="" className="object-fit-cover" />
                                    </div>}

                                <div className="article-body" dangerouslySetInnerHTML={{ __html: sanitize(article?.body) }} />

                                <footer className="d-flex flex-wrap align-items-center justify-content-between gap-3 border-top pt-4 mt-5">
                                    <Link to="/articles" className="btn btn-outline-secondary d-inline-flex align-items-center gap-2">
                                        <FaArrowLeft /> All articles
                                    </Link>
                                    <div className="d-flex align-items-center gap-2">
                                        <span className="small text-body-secondary me-1">Share</span>
                                        {shareLinks.map(link => (
                                            <a key={link.label} href={link.href(window.location.href)} target="_blank" rel="noreferrer" aria-label={link.label} title={link.label}
                                                className="btn btn-outline-secondary rounded-circle d-inline-flex align-items-center justify-content-center p-2 lh-1">
                                                {link.icon}
                                            </a>
                                        ))}
                                        <button type="button" onClick={copyLink} aria-label="Copy link" title="Copy link"
                                            className="btn btn-outline-secondary rounded-circle d-inline-flex align-items-center justify-content-center p-2 lh-1">
                                            <FaLink />
                                        </button>
                                    </div>
                                </footer>
                            </div>}
                    </article>
                </div>

                <div className="col-12 col-lg-4">
                    <div className="article-sidebar">
                        <ArticleSidebar />
                    </div>
                </div>
            </div>
        </div>
    )
}

const ELEMENT_CLASSES: Record<string, string> = {
    IMG: "img-fluid rounded-3",
    TABLE: "table table-bordered",
    BLOCKQUOTE: "blockquote",
    PRE: "bg-body-tertiary border rounded-3 p-3 overflow-auto",
}
DOMPurify.addHook("afterSanitizeAttributes", (node) => {
    const extra = ELEMENT_CLASSES[node.nodeName]
    if (extra) node.setAttribute("class", `${node.getAttribute("class") ?? ""} ${extra}`.trim())
    if (node.nodeName === "A" && node.getAttribute("href")?.startsWith("http")) {
        node.setAttribute("target", "_blank")
        node.setAttribute("rel", "noopener noreferrer")
    }
})
const sanitize = (html?: string) => DOMPurify.sanitize(html ?? "", { ADD_ATTR: ["target"] })

const shareLinks = [
    { label: "Share on Telegram", icon: <FaTelegram />, href: (url: string) => `https://t.me/share/url?url=${encodeURIComponent(url)}` },
    { label: "Share on X", icon: <FaXTwitter />, href: (url: string) => `https://x.com/intent/post?url=${encodeURIComponent(url)}` },
    { label: "Share on Facebook", icon: <FaFacebookF />, href: (url: string) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}` },
]
