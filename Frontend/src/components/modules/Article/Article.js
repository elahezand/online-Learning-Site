import { useState } from 'react';
import "./Article.css"
import Spinner from 'react-bootstrap/esm/Spinner';
import { BiSolidCameraOff } from "react-icons/bi";
import { Link } from 'react-router-dom';




export default function Article(props) {
    const [isShowImage, setIsImageShow] = useState(false)
    const [isShowError, setIsShowError] = useState(false)

    const onImageLoaded = () => setIsImageShow(true)
    const onImageError = () => setIsShowError(true)

    return (
        <>
            <div className='container-article'>
                <div className='article-img'>
                    {!isShowError ?
                        <img src={`http://localhost:4000/courses/covers/${props.cover}`} alt=""
                            onLoad={onImageLoaded} onError={onImageError} loading='lazy' /> :
                        <BiSolidCameraOff style={{ fontSize: "4rem", color: "#eeee" }} />
                    }
                </div>
                    {!isShowImage && !isShowError &&
                        <div className='spinner'>
                            <Spinner animation='grow' style={{ marginTop: "2rem" }} />
                        </div>}
                <div>
                    <h2 className='article-title'>{props.title}</h2>
                    <p className='article-body'>
                        {props.description.slice(0, 100)} </p>
                    <Link to={`/article-info/${props.shortName}`}>
                        <button className='btn-article'>Read more</button>
                    </Link>
                </div>
            </div>

        </>
    )
}
