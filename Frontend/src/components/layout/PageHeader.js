import BreadCrumb from "../ui/BreadCrumb"

export default function PageHeader({ title, subtitle, image = "/images/blog/bg_2.jpg.webp", breadcrumb }) {
    return (
        <section className="position-relative overflow-hidden d-flex align-items-center" data-bs-theme="dark"
            style={{ background: `url(${image}) center 80% / cover no-repeat`,minHeight:"130vh" }}>
            <div className="position-absolute top-0 start-0 w-100 h-100 bg-black banner-overlay" />

            <div className="container position-relative py-5">
                <div className="py-4 py-md-5 my-lg-4">
                    {breadcrumb && <BreadCrumb links={breadcrumb} />}
                    <h1 className="display-6 fw-bold text-white mt-2 mb-0">{title}</h1>
                    {subtitle && <p className="lead text-white text-opacity-75 mt-2 mb-0">{subtitle}</p>}
                </div>
            </div>
        </section>
    )
}