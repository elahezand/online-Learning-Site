export default function AboutUsBox({ title, desc, icon }) {
    return (
        <div className='surface hover-lift d-flex align-items-center gap-3 p-3 flex-grow-1'>
            <span className="icon-badge icon-badge--lg">
                <i className={icon}></i>
            </span>
            <div className="d-flex flex-column">
                <h3 className="h6 fw-bold text-primary-strong mb-1">{title}</h3>
                <p className="small text-body-secondary mb-0">{desc}</p>
            </div>
        </div>
    )
}
