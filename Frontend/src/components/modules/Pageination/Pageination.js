import "./Pageination.css"
import { Link } from 'react-router-dom'

export default function Pageination({ data, pathName, pageCount, currentPage }) {

    return (

        <>
            {data.length ?
                <ul className="courses__pagination-list">
                    {Array(pageCount).fill(0).map((item, index) => {
                        return <li key={index + 1}
                            className={`courses__pagination-item 
                        ${index + 1 == currentPage && "active"}`} >
                            <Link
                                to={`${pathName}/${index + 1}`}
                                className="courses__pagination-link">
                                {index + 1}
                            </Link>
                        </li>
                    })}
                </ul> : null}
        </>
    )

}



