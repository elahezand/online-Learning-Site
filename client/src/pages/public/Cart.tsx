import { Link } from "react-router-dom"
import { FaArrowLeft, FaArrowRight, FaCartShopping, FaTag, FaXmark } from "react-icons/fa6"
import PageHeader from "../../components/ui/PageHeader"
import { CourseCover, CoursePrice } from "../../features/courses/CourseCard"
import CartSummary from "../../features/cart/CartSummary"
import useCart from "../../features/cart/useCart"

export default function Cart() {
    const { items, count, subtotal, savings, total, remove } = useCart()

    return (
        <>
            <PageHeader title="Your cart" subtitle={count ? `${count} ${count === 1 ? "course" : "courses"} ready to start` : undefined}
                image="/images/blog/hero_1.jpg.webp"
                breadcrumb={[{ title: "Home", to: "/" }, { title: "Cart" }]} />

            <div className="container py-5">
                {count === 0 ?
                    <div className="card border-0 shadow-sm rounded-4 text-center py-5 px-3 mx-auto" style={{ maxWidth: "36rem" }}>
                        <span className="d-inline-flex align-items-center justify-content-center rounded-circle bg-primary-subtle text-primary-emphasis fs-2 p-4 lh-1 mx-auto mb-4">
                            <FaCartShopping />
                        </span>
                        <h2 className="h4 fw-bold">Your cart is empty</h2>
                        <p className="text-body-secondary mb-4">Find a course you like and add it to your cart.</p>
                        <div>
                            <Link to="/courses" className="btn btn-primary btn-lg rounded-pill px-4 d-inline-flex align-items-center gap-2">
                                Browse courses <FaArrowRight />
                            </Link>
                        </div>
                    </div> :
                    <div className="row g-4 g-xl-5 align-items-start">
                        <div className="col-12 col-lg-8">
                            <section className="card border-0 shadow-sm rounded-4">
                                <div className="card-header bg-transparent d-flex align-items-center justify-content-between py-3 px-4">
                                    <h2 className="h5 fw-bold mb-0">Courses</h2>
                                    <span className="small text-body-secondary">{count} {count === 1 ? "item" : "items"}</span>
                                </div>
                                <ul className="list-group list-group-flush">
                                    {items.map(item => (
                                        <li key={item._id} className="list-group-item px-4 py-3">
                                            <div className="d-flex align-items-center gap-3">
                                                <Link to={`/course-info/${item.shortName}`} className="flex-shrink-0 rounded-3 overflow-hidden" style={{ width: "min(9rem, 30vw)" }}>
                                                    <CourseCover cover={item.cover} />
                                                </Link>
                                                <div className="flex-grow-1 overflow-hidden">
                                                    <Link to={`/course-info/${item.shortName}`} className="fw-semibold link-body-emphasis text-decoration-none d-block text-truncate">
                                                        {item.name}
                                                    </Link>
                                                    {item.discount && item.price ?
                                                        <span className="badge rounded-pill bg-success-subtle text-success-emphasis d-inline-flex align-items-center gap-1 mt-2">
                                                            <FaTag /> {item.discount}% off
                                                        </span> : null}
                                                    <div className="d-sm-none mt-2"><CoursePrice price={item.price} discount={item.discount} /></div>
                                                </div>
                                                <div className="d-none d-sm-block text-end flex-shrink-0">
                                                    <CoursePrice price={item.price} discount={item.discount} />
                                                </div>
                                                <button type="button" className="btn btn-sm btn-outline-secondary rounded-circle p-2 lh-1 flex-shrink-0"
                                                    onClick={() => remove(item._id)} aria-label={`Remove ${item.name}`} title="Remove">
                                                    <FaXmark />
                                                </button>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </section>
                            <Link to="/courses" className="btn btn-link px-0 mt-3 d-inline-flex align-items-center gap-2 text-decoration-none">
                                <FaArrowLeft /> Continue shopping
                            </Link>
                        </div>

                        <div className="col-12 col-lg-4">
                            <div className="sticky-lg-top d-grid gap-3" style={{ top: "6rem" }}>
                                <CartSummary subtotal={subtotal} savings={savings} total={total} count={count}>
                                    <form className="mt-4" onSubmit={(e) => e.preventDefault()}>
                                        <label htmlFor="discount-code" className="form-label small fw-medium">Discount code</label>
                                        <div className="input-group">
                                            <input id="discount-code" className="form-control" placeholder="Enter code" disabled />
                                            <button type="submit" className="btn btn-outline-secondary" disabled>Apply</button>
                                        </div>
                                        <div className="form-text">Discount codes can be used soon.</div>
                                    </form>
                                    <Link to="/checkout" className="btn btn-primary btn-lg w-100 rounded-pill mt-4 d-inline-flex align-items-center justify-content-center gap-2">
                                        Checkout <FaArrowRight />
                                    </Link>
                                </CartSummary>
                            </div>
                        </div>
                    </div>}
            </div>
        </>
    )
}
