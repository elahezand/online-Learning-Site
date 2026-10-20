import { useState } from 'react';
import "./Article.css"
import Spinner from 'react-bootstrap/esm/Spinner';
import { BiSolidCameraOff } from "react-icons/bi";
import { Link } from 'react-router-dom';
import { coverUrl } from '../../../config/env'


export default function Article(props) {
    const [isShowImage, setIsImageShow] = useState(false)
    const [isShowError, setIsShowError] = useState(false)

    return (
        <article className='card article-card hover-lift h-100'>
            <div className='article-card__cover'>
                {!isShowError ?
                    <img src={coverUrl(props.cover)} alt=""
                        onLoad={() => setIsImageShow(true)}
                        onError={() => setIsShowError(true)} loading='lazy' /> :
                    <div className="img-fallback"><BiSolidCameraOff /></div>
                }
                {!isShowImage && !isShowError &&
                    <div className='article-card__spinner'>
                        <Spinner animation='grow' size="sm" />
                    </div>}
            </div>
            <div className="card-body d-flex flex-column">
                <h3 className='card-title h5 fw-bold'>{props.title}</h3>
                <p className='card-text text-body-secondary small'>
                    {props.description?.slice(0, 100)}
                </p>
                <Link to={`/article-info/${props.shortName}`} className='btn btn-outline-primary btn-sm align-self-start mt-auto'>
                    Read more
                </Link>
            </div>
        </article>
    )
}
