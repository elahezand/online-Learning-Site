import { Link } from "react-router-dom"
import { FaArrowRight } from "react-icons/fa6"

interface SectionHeaderProps {
    title: string
    desc?: string
    btnTitle?: string
    btnHref?: string
}

export default function SectionHeader({ title, desc, btnTitle, btnHref }: SectionHeaderProps) {
    return (
        <div className="d-flex flex-wrap align-items-end justify-content-between gap-3 mb-4">
            <div>
                <h2 className="h3 fw-bold mb-1">{title}</h2>
                {desc && <p className="text-body-secondary mb-0">{desc}</p>}
            </div>
            {btnTitle &&
                <Link to={btnHref || "#"} className="btn btn-outline-primary d-inline-flex align-items-center gap-2">
                    {btnTitle} <FaArrowRight />
                </Link>}
        </div>
    )
}
