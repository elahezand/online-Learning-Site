import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import ArticleSidebar from './ArticleSidebar'
import type { Article, Category } from "../../types/models"
import DOMPurify from "dompurify"
import { FaFacebookF, FaRegClock, FaRegUser, FaTelegram, FaXTwitter } from "react-icons/fa6"
import { useArticle } from './hooks'
import { useAuth } from '../auth/useAuth'
import { coverUrl } from '../../config/env'

export default function ArticleDetail() {

    const param = useParams()
    const navigate = useNavigate()

    const { data } = useArticle(param.articleName)
    const articleData: Partial<Article> = data ?? {}
    const articleCreator: Partial<NonNullable<Article["creator"]>> = articleData.creator ?? {}
    const categoryId: Partial<Category> = articleData.categoryID ?? {}
    const createdAt = articleData.createdAt ?? ""
    const articleCover = articleData.cover

    // The article endpoint requires a logged-in user
    const { status } = useAuth()
    useEffect(() => {
        if (status === "guest") navigate("/login", { state: { from: { pathname: `/article-info/${param.articleName}` } } })
    }, [status, navigate, param.articleName])

    return (
        <div className="container py-4 py-lg-5">
            <div className="row g-4 g-xl-5">
                <div className="col-12 col-lg-8">
                    <article className="card shadow-sm">
                        <div className="card-body p-3 p-sm-4 p-lg-5">
                            <div className="d-flex flex-wrap gap-3 small text-body-secondary mb-4">
                                {categoryId.title &&
                                    <span className="badge rounded-pill text-bg-primary">{categoryId.title}</span>}
                                <span className="d-inline-flex align-items-center gap-2"><FaRegUser /> {articleCreator.name}</span>
                                <span className="d-inline-flex align-items-center gap-2"><FaRegClock /> {createdAt.slice(0, 10)}</span>
                            </div>

                            {articleCover &&
                                <div className="ratio ratio-21x9 rounded-3 overflow-hidden bg-body-secondary mb-4">
                                    <img src={coverUrl(articleCover)} alt="" className="object-fit-cover" />
                                </div>}

                            <div className="fs-5 lh-lg" dangerouslySetInnerHTML={{ __html: sanitize(articleData.body) }} />

                            <div className="d-flex align-items-center gap-2 border-top pt-3 mt-4">
                                <span className="small text-body-secondary me-1">Share:</span>
                                {shareLinks.map(link => (
                                    <a key={link.label} href={link.href(window.location.href)} target="_blank" rel="noreferrer" aria-label={link.label}
                                        className="btn btn-outline-secondary d-inline-flex align-items-center justify-content-center p-2 lh-1">
                                        {link.icon}
                                    </a>
                                ))}
                            </div>
                        </div>
                    </article>
                </div>

                <div className="col-12 col-lg-4">
                    <ArticleSidebar />
                </div>
            </div>
        </div>
    )
}

/* Article HTML comes from the editor: sanitize it and give its elements
   Bootstrap classes, so images and tables stay inside the column on phones. */
const ELEMENT_CLASSES: Record<string, string> = { IMG: "img-fluid rounded-3", TABLE: "table table-bordered", BLOCKQUOTE: "blockquote border-start border-4 border-primary ps-3", PRE: "bg-body-tertiary border rounded-3 p-3 overflow-auto" }
DOMPurify.addHook("afterSanitizeAttributes", (node) => {
    const extra = ELEMENT_CLASSES[node.nodeName]
    if (extra) node.setAttribute("class", `${node.getAttribute("class") ?? ""} ${extra}`.trim())
})
const sanitize = (html?: string) => DOMPurify.sanitize(html ?? "")

const shareLinks = [
    { label: "Share on Telegram", icon: <FaTelegram />, href: (url: string) => `https://t.me/share/url?url=${encodeURIComponent(url)}` },
    { label: "Share on X", icon: <FaXTwitter />, href: (url: string) => `https://x.com/intent/post?url=${encodeURIComponent(url)}` },
    { label: "Share on Facebook", icon: <FaFacebookF />, href: (url: string) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}` },
]
