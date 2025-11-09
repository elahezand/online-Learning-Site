import{ useState } from 'react'
import "./Course.css"
import Spinner from 'react-bootstrap/esm/Spinner';
import { BiSolidCameraOff } from "react-icons/bi";
import { Link } from 'react-router-dom';


export default function Course(props) {
    const [isShowImage, setIsImageShow] = useState(false)
    const [isShowError, setIsShowError] = useState(false)


    const onImageLoaded = () => setIsImageShow(true)
    const onImageError = () => setIsShowError(true)




    return (

        props.direction && props.direction === "row" ?
            <div className="course">
                {props.discount && props.price !== 0 ?
                    <span className='course-discount'>%{props.discount} </span>
                    : null
                }

                <div className="image-course">
                    {!isShowError ?
                        <img src={`http://localhost:4000/courses/covers/${props.cover}`} alt="" loading='lazy'
                            onLoad={onImageLoaded}
                            onError={onImageError} /> :
                        <BiSolidCameraOff
                            style={{ fontSize: "5rem", color: "#eeee" }} />
                    }
                </div>
                {!isShowImage && !isShowError &&
                    <div className='spinner'>
                        <Spinner />
                    </div>}

                <div className="course-information">
                    <h2>{props.name}</h2>
                    <div className="course-information_rate">
                        <div className="author">
                            <i className="fa-solid fa-chalkboard-user"></i>
                            <span className="author-name">{props.creator}</span>
                        </div>
                        <div className='course-box__star'>
                            <i className='fa fa-star'></i>
                            <span>{`(${props.courseAverageScore})`}</span>
                        </div>
                    </div>

                    <div className='course-information_price'>
                        <div className="price">
                            <span className="course-box__price">price :
                                {props.price === 0 ?
                                    "Free" :
                                    props.discount ? (props.price) - ((props.price * props.discount) / 100) : props.price}</span>
                            {props.discount && props.price > 0 ? <span className='old-price'>{props.price} $</span> : null}
                        </div>
                        <div className="users">
                            <span className="author-name">{props.registers}</span>
                            <i className="fa-solid fa-users"></i>
                        </div>
                    </div>
                </div>
                <div className="more-information">
                    <Link to={`/course-info/${props.shortName}/1`}>View Information
                        <i className='fa fa-arrow-right'></i>
                    </Link>
                </div>
            </div>
            :
            props.direction && props.direction === "column" ?
                <div className="course-box">
                    {props.discount && props.price !== 0 ?
                        <span className='course-discount'>%{props.discount} </span>
                        : null
                    }
                    <div className="course-box_image">
                        <img src={`http://localhost:4000/courses/covers/${props.cover}`}
                            alt='' loading='lazy' />
                    </div>

                    <div className="course-box__main">
                        <Link to={`/course-info/${props.shortName}/1`}>
                            {props.name}
                        </Link>
                        <div className="course-box__status">
                            <div className="course-box__rating-teacher">
                                <div className="course-box__teacher">
                                    <i className="fas fa-chalkboard-teacher course-box__teacher-icon"></i>
                                    <Link to={"#"} className="course-box__teacher-link">{props.creator}</Link>
                                </div>
                                <div className='course-box__star'>
                                    <i className='fa fa-star'></i>
                                    <span>{`(${props.courseAverageScore})`}</span>
                                </div>
                            </div>
                            <div className="course-box__discription">
                                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Praesentium ipsam, nihil officia dolor eaque vel aliquam. Maiores saepe recusandae voluptas tempore id quia adipisci natus..</p>
                            </div>
                            <div className="course-box__users">
                                <i className="fas fa-users course-box__users-icon"></i>
                                <span className="course-box__users-text">{props.registers}</span>
                            </div>
                            <div className='price'>
                                <span className="course-box__price">price :
                                    {props.price === 0 ?
                                        "Free" :
                                        props.discount ? (props.price) - ((props.price * props.discount) / 100) : props.price}</span>
                                {props.discount && props.price > 0 ?
                                    <span className='old-price'>{props.price} $</span> : null}
                            </div>
                        </div>
                        <div className="course-box__footer">
                            <Link to={`/course-info/${props.shortName}/1`}>
                                View Information
                                <i className='fa fa-arrow-right'></i>
                            </Link>
                        </div>
                    </div>
                </div>
                :
                <div className="course">
                    {props.discount && props.price !== 0 ?
                        <span
                            className='course-discount'>%{props.discount}</span>
                        : null
                    }

                    <div className="image-course">
                        {!isShowError ?
                            <img src={`http://localhost:4000/courses/covers/${props.cover}`}
                                alt="" loading='lazy'
                                onLoad={onImageLoaded}
                                onError={onImageError} /> :
                            <BiSolidCameraOff
                                style={{ fontSize: "5rem", color: "#eeee" }} />
                        }
                    </div>
                    {!isShowImage && !isShowError &&
                        <div className='spinner'>
                            <Spinner />
                        </div>}

                    <div className="course-information">
                        <h2>{props.name}</h2>
                        <div className="course-information_rate">
                            <div className="author">
                                <i className="fa-solid fa-chalkboard-user"></i>
                                <span className="author-name">{props.creator}</span>
                            </div>
                            <div className='course-box__star'>
                                <i className='fa fa-star'></i>
                                <span>{`(${props.courseAverageScore})`}</span>
                            </div>
                        </div>

                        <div className='course-information_price'>
                            <div className="price">
                                <span className="course-box__price">price :
                                    {props.price === 0 ?
                                        "Free" :
                                        props.discount ? (props.price) - ((props.price * props.discount) / 100) : props.price}</span>
                                {props.discount && props.price > 0 ? <span className='old-price'>{props.price} $</span> : null}
                            </div>
                            <div className="users">
                                <span className="author-name">{props.registers}</span>
                                <i className="fa-solid fa-users"></i>
                            </div>
                        </div>
                    </div>
                    <div className="more-information">
                        <Link to={`/course-info/${props.shortName}/1`}>View Information
                            <i className='fa fa-arrow-right'></i>
                        </Link>
                    </div>
                </div>
    )
}




