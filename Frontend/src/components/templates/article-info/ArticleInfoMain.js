import { useEffect, useState } from 'react'
import "./ArticleInfoMain.css"
import { useParams, useNavigate } from 'react-router-dom'
import ArticleInfoSidebar from '../article-info/ArticleInfoSidebar'
import DOMPpurify from "dompurify"
import { Link } from 'react-router-dom'
import getMe from '../../../utils/auth'

export default function ArticleInfoMain() {

    const param = useParams()
    const navigate = useNavigate()

    const [articleData, setArticleData] = useState([])
    const [articleCreator, setArticleCreator] = useState([])
    const [categoryId, setCategoryId] = useState([])
    const [createdAt, setCreatedAt] = useState("")
    const [articleCover, setArticleCover] = useState("")

    const getMainArticle = async () => {
        const token = await getMe()
        if (token) {
            const res = await fetch(`http://localhost:4000/v1/articles/${param.articleName}`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            })

            if (res.status === 200) {
                const data = await res.json()
                setArticleData(data)
                setArticleCreator(data.creator)
                setCategoryId(data.categoryID)
                setCreatedAt(data.createdAt)
                setArticleCover(data.cover)
            }
        }
        else {
            navigate("/login")
        }
    }


    useEffect(() => {
        getMainArticle()
    }, [])



    return (
        <>
            <div className='container mt-5'>
                <div className='row'>
                    <ArticleInfoSidebar />
                    <div className="col-8">
                        <div className="article">
                            <h1 className="article__title">
                                {articleData.title}
                            </h1>
                            <div className="article__header">
                                <div className="article-header__category article-header__item">
                                    <i className="far fa-folder article-header__icon"></i>
                                    <Link href="#" className="article-header__text">{categoryId.name}</Link>
                                </div>

                                <div className="article-header__category article-header__item">
                                    <i className="far fa-clock article-header__icon"></i>
                                    <span className="article-header__text">Posted by : {articleCreator.name}</span>
                                </div>

                                <div className="article-header__category article-header__item">
                                    <i className="far fa-clock article-header__icon"></i>
                                    <span className="article-header__text">Posted :{createdAt.slice(0, 10)}</span>
                                </div>

                                <div className="article-header__category article-header__item">
                                    <i className="far fa-eye article-header__icon"></i>
                                    <span className="article-header__text">Views :1.4k</span>
                                </div>
                            </div>
                            <img src={`http://localhost:4000/courses/covers/${articleCover}`}
                                alt="Article Cover" className="article__banner"></img>

                            <div className="article__score">
                                <div className="article__score-icons">
                                    <i className="fa-solid fa-star"></i>
                                    <i className="fa-solid fa-star"></i>
                                    <i className="fa-solid fa-star"></i>
                                    <i className="fa-solid fa-star"></i>
                                    <i className="fa-solid fa-star"></i>
                                </div>
                                <span className="article__score-text">5/5 - (5 score)</span>
                            </div>

                            <div className="article-section">
                                <div
                                    dangerouslySetInnerHTML={{ __html: DOMPpurify.sanitize(articleData.body) }}
                                    className="paragraph article-section__text">
                                </div>

                            </div>

                            <div className="article-social-media">
                                <span className="article-social-media__text"> Share :</span>
                                <Link href="#" className="article-social-media__link">
                                    <i className="fab fa-telegram-plane article-social-media__icon"></i>
                                </Link>
                                <Link href="#" className="article-social-media__link">
                                    <i className="fab fa-twitter article-social-media__icon"></i>
                                </Link>
                                <Link href="#" className="article-social-media__link">
                                    <i className="fab fa-facebook-f article-social-media__icon"></i>
                                </Link>
                            </div>

                        </div>
                        <div className="suggestion-articles">
                            <div className="row">
                                <div className="col-6">
                                    <div className="suggestion-articles__right suggestion-articles__content">
                                        <Link href="#" className="suggestion-articles__icon-link">
                                            <i className="fas fa-arrow-left suggestion-articles__icon"></i>
                                        </Link>
                                        <Link href="#" className="suggestion-articles__link">
                                            Lorem ipsum dolor sit amet consectetur,
                                            adipisicing elit. Voluptatibus sequi repellendus iste consectetur aspernatur beatae!
                                        </Link>
                                    </div>
                                </div>
                                <div className="col-6">
                                    <div className="suggestion-articles__left suggestion-articles__content">
                                        <Link href="#" className="suggestion-articles__icon-link">
                                            <i className="fas fa-arrow-right suggestion-articles__icon"></i>
                                        </Link>
                                        <Link href="#" className="suggestion-articles__link">
                                            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nesciunt, quia?
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
