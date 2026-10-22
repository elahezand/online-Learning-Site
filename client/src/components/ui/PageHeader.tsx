import BreadCrumb from "../ui/BreadCrumb"
import type { Crumb } from "../ui/BreadCrumb"

interface PageHeaderProps {
    title: string
    subtitle?: string
    image?: string
    breadcrumb?: Crumb[]
}

export default function PageHeader({ title, subtitle, image = "/images/blog/bg_2.jpg.webp", breadcrumb }: PageHeaderProps) {
    return (
        <section className="page-header position-relative overflow-hidden border-bottom">
            <div className="container position-relative">
                <div className="row align-items-center gy-4 gx-lg-5 py-5 my-lg-3">
                    <div className="col-lg-6 text-center text-lg-start">
                        {breadcrumb &&
                            <div className="d-inline-block bg-body border rounded-pill shadow-sm px-3 py-1 mb-3">
                                <BreadCrumb links={breadcrumb} />
                            </div>}
                        <h1 className="display-5 fw-bold text-body-emphasis lh-sm text-break mb-0">{title}</h1>
                        {subtitle && <p className="lead text-body-secondary mt-3 mb-0 col-xl-10 mx-auto mx-lg-0">{subtitle}</p>}
                        <span className="page-header__line d-block bg-primary rounded-pill mt-4 mx-auto mx-lg-0" aria-hidden="true" />
                    </div>

                    <div className="col-lg-6 d-none d-lg-block">
                        <div className="page-header__photo-wrap">
                            <img src={image} alt="" className="page-header__photo w-100 rounded-5 shadow-lg" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}