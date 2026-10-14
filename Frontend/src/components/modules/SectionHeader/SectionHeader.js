import { Link } from 'react-router-dom'

export default function SectionHeader({ title, desc, btnTitle, btnHref }) {
    return (
        <div className='d-flex flex-wrap align-items-end justify-content-between gap-3 my-4'>
            <div className="d-flex flex-column">
                <h2 className="section-title">{title}</h2>
                {desc && <span className="text-body-secondary">{desc}</span>}
            </div>
            {btnTitle &&
                <Link to={btnHref || "#"} className="btn btn-primary d-inline-flex align-items-center gap-2">
                    {btnTitle}
                    <i className='fa fa-arrow-right'></i>
                </Link>
            }
        </div>
    )
}
