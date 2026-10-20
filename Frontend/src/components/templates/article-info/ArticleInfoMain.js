import { useEffect } from 'react'
import "./ArticleInfoMain.css"
import { useParams, useNavigate } from 'react-router-dom'
import ArticleInfoSidebar from '../article-info/ArticleInfoSidebar'
import DOMPpurify from "dompurify"
import { Link } from 'react-router-dom'
import { useArticle } from '../../../api'
import { useAuth } from '../../../context/AuthContext'
import { coverUrl } from '../../../config/env'

export default function ArticleInfoMain() {

    const param = useParams()
    const navigate = useNavigate()

    const { data: articleData = {} } = useArticle(param.articleName)
    const articleCreator = articleData.creator ?? {}
    const categoryId = articleData.categoryID ?? {}
    const createdAt = articleData.createdAt ?? ""
    const articleCover = articleData.cover

    // The article endpoint requires a logged-in user
    const { status } = useAuth()
    useEffect(() => {
        if (status === "guest") navigate("/login", { state: { from: { pathname: `/article-info/${param.articleName}` } } })
    }, [status, navigate, param.articleName])

    return (
        <div className='container mt-4'>
            <div className='row g-4'>
                <ArticleInfoSidebar />
                <div className="col-12 col-lg-8 order-1 order-lg-2">
                    <article className="card article-detail p-3 p-sm-4">
                        <h1 className="article-detail__title">
                            {articleData.title}
                        </h1>
                        <div className="d-flex flex-wrap gap-3 small text-body-secondary py-3">
                            <span className="d-inline-flex align-items-center gap-2">
                                <i className="far fa-folder"></i>
                                <Link to="#" className="text-body-secondary">{categoryId.name}</Link>
                            </span>
                            <span className="d-inline-flex align-items-center gap-2">
                                <i className="far fa-user"></i>
                                Posted by : {articleCreator.name}
                            </span>
                            <span className="d-inline-flex align-items-center gap-2">
                                <i className="far fa-clock"></i>
                                Posted : {createdAt.slice(0, 10)}
                            </span>
                            <span className="d-inline-flex align-items-center gap-2">
                                <i className="far fa-eye"></i>
                                Views : 1.4k
                            </span>
                        </div>
                        <img src={coverUrl(articleCover)}
                            alt="Article Cover" className="article-detail__banner"></img>

                        <div className="d-flex align-items-center gap-3 my-3">
                            <div className="text-star d-inline-flex gap-1">
                                <i className="fa-solid fa-star"></i>
                                <i className="fa-solid fa-star"></i>
                                <i className="fa-solid fa-star"></i>
                                <i className="fa-solid fa-star"></i>
                                <i className="fa-solid fa-star"></i>
                            </div>
                            <span className="small text-body-secondary">5/5 - (5 score)</span>
                        </div>

                        <div
                            dangerouslySetInnerHTML={{ __html: DOMPpurify.sanitize(articleData.body) }}
                            className="article-detail__body my-4">
                        </div>

                        <div className="d-flex align-items-center gap-2 border-top pt-3">
                            <span className="small text-body-secondary me-1">Share :</span>
                            <Link to="#" className="icon-btn" aria-label="Telegram">
                                <i className="fab fa-telegram-plane"></i>
                            </Link>
                            <Link to="#" className="icon-btn" aria-label="Twitter">
                                <i className="fab fa-twitter"></i>
                            </Link>
                            <Link to="#" className="icon-btn" aria-label="Facebook">
                                <i className="fab fa-facebook-f"></i>
                            </Link>
                        </div>
                    </article>

                    <div className="row g-3 mt-2">
                        <div className="col-12 col-md-6">
                            <Link to="#" className="surface hover-lift d-flex align-items-center gap-3 p-3 h-100 article-nav">
                                <i className="fas fa-arrow-left text-primary-strong"></i>
                                <span className="d-flex flex-column">
                                    <span className="small text-body-secondary">Older</span>
                                    <span className="text-heading">
                                        Lorem ipsum dolor sit amet consectetur,
                                        adipisicing elit. Voluptatibus sequi repellendus iste consectetur aspernatur beatae!
                                    </span>
                                </span>
                            </Link>
                        </div>
                        <div className="col-12 col-md-6">
                            <Link to="#" className="surface hover-lift d-flex flex-row-reverse align-items-center gap-3 p-3 h-100 text-end article-nav">
                                <i className="fas fa-arrow-right text-primary-strong"></i>
                                <span className="d-flex flex-column">
                                    <span className="small text-body-secondary">Newer</span>
                                    <span className="text-heading">
                                        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nesciunt, quia?
                                    </span>
                                </span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
