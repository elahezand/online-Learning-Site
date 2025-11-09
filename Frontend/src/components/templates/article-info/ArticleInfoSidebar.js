import "./ArticleInfoSidebar.css"

export default function ArticleInfoSidebar() {
    return (
        <>

            <div className="col-4">
                <div className="courses-info">
                    <div className="course-info">
                        <span className="course-info__courses-title">Highest-rated courses</span>
                        <ul className="course-info__courses-list">
                            <li className="course-info__courses-list-item">
                                <a href="#" className="course-info__courses-link">
                                    <img src="/images/courses/js_project.png" alt="Course Cover" className="course-info__courses-img"></img>
                                    <span className="course-info__courses-text">
                                        Lorem ipsum dolor sit amet.
                                    </span>
                                </a>
                            </li>
                            <li className="course-info__courses-list-item">
                                <a href="#" className="course-info__courses-link">
                                    <img src="/images/courses/fareelancer.png" alt="Course Cover" className="course-info__courses-img"></img>
                                    <span className="course-info__courses-text">
                                        Lorem ipsum dolor sit amet.
                                    </span>
                                </a>
                            </li>
                            <li className="course-info__courses-list-item">
                                <a href="#" className="course-info__courses-link">
                                    <img src="/images/courses/nodejs.png" alt="Course Cover" className="course-info__courses-img"></img>
                                    <span className="course-info__courses-text">
                                        Lorem ipsum dolor sit.
                                    </span>
                                </a>
                            </li>
                            <li className="course-info__courses-list-item">
                                <a href="#" className="course-info__courses-link">
                                    <img src="/images/courses/jango.png" alt="Course Cover" className="course-info__courses-img"></img>
                                    <span className="course-info__courses-text">
                                        Lorem ipsum dolor sit.
                                    </span>
                                </a>
                            </li>
                        </ul>
                    </div>


                    <div className="course-info">
                        <span className="course-info__courses-title">Quick access</span>
                        <ul className="sidebar-articles__list">
                            <li className="sidebar-articles__item">
                                <a href="#" className="sidebar-articles__link"> Home</a>
                                <i className="fas fa-angle-right sidebar-articles__icon"></i>
                            </li>
                            <li className="sidebar-articles__item">
                                <a href="#" className="sidebar-articles__link"> Frontend</a>
                                <i className="fas fa-angle-right sidebar-articles__icon"></i>
                            </li>
                            <li className="sidebar-articles__item">
                                <a href="#" className="sidebar-articles__link">Security</a>
                                <i className="fas fa-angle-right sidebar-articles__icon"></i>
                            </li>
                            <li className="sidebar-articles__item">
                                <a href="#" className="sidebar-articles__link">Python</a>
                                <i className="fas fa-angle-right sidebar-articles__icon"></i>
                            </li>
                            <li className="sidebar-articles__item">
                                <a href="#" className="sidebar-articles__link"> Soft skills </a>
                                <i className="fas fa-angle-right sidebar-articles__icon"></i>
                            </li>
                        </ul>
                    </div>


                    <div className="course-info">
                        <span className="course-info__courses-title"> New articles </span>
                        <ul className="last-articles__list">
                            <li className="last-articles__item">
                                <a href="#" className="last-articles__link">
                                    How to install a library in Python|Tutorial on installing Python libraries

                                </a>
                            </li>
                            <li className="last-articles__item">
                                <a href="#" className="last-articles__link">
                                    How to install a library in Python|Tutorial on installing Python libraries

                                </a>
                            </li>
                            <li className="last-articles__item">
                                <a href="#" className="last-articles__link">
                                    How to install a library in Python|Tutorial on installing Python libraries

                                </a>
                            </li>
                            <li className="last-articles__item">
                                <a href="#" className="last-articles__link">
                                    How to install a library in Python|Tutorial on installing Python libraries

                                </a>
                            </li>
                            <li className="last-articles__item">
                                <a href="#" className="last-articles__link">
                                    How to install a library in Python|Tutorial on installing Python libraries

                                </a>
                            </li>
                            <li className="last-articles__item">
                                <a href="#" className="last-articles__link">
                                    How to install a library in Python|Tutorial on installing Python libraries

                                </a>
                            </li>
                        </ul>
                    </div>


                </div>
            </div>
        </>
    )
}
