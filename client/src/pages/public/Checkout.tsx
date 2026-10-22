import { useState } from "react"
import { Link } from "react-router-dom"
import { FaArrowLeft, FaCircleInfo, FaCreditCard, FaWallet } from "react-icons/fa6"
import PageHeader from "../../components/ui/PageHeader"
import { CourseCover } from "../../features/courses/CourseCard"
import CartSummary from "../../features/cart/CartSummary"
import { finalPrice, money } from "../../features/cart/cartStore"
import useCart from "../../features/cart/useCart"
import { useAuth } from "../../features/auth/useAuth"

const STEPS = ["Cart", "Details", "Payment"]

const METHODS = [
    { value: "card", label: "Online payment", hint: "Pay with your bank card", icon: <FaCreditCard /> },
    { value: "wallet", label: "Wallet", hint: "Pay from your ACADEMIA wallet", icon: <FaWallet /> },
] as const

type Method = typeof METHODS[number]["value"]

function Steps({ current }: { current: number }) {
    return (
        <ol className="list-unstyled d-flex align-items-center justify-content-center gap-2 gap-sm-3 mb-4 mb-lg-5 small fw-medium">
            {STEPS.map((step, index) => (
                <li key={step} className="d-flex align-items-center gap-2 gap-sm-3">
                    <span className={`d-inline-flex align-items-center justify-content-center rounded-circle fw-bold ${index <= current ? "text-bg-primary" : "bg-body-secondary text-body-secondary"}`}
                        style={{ width: 28, height: 28 }}>{index + 1}</span>
                    <span className={index <= current ? "text-body-emphasis" : "text-body-secondary"}>{step}</span>
                    {index < STEPS.length - 1 && <span className="border-top d-inline-block" style={{ width: "2.5rem" }} aria-hidden="true" />}
                </li>
            ))}
        </ol>
    )
}

export default function Checkout() {
    const { userInfo } = useAuth()
    const { items, count, subtotal, savings, total } = useCart()
    const [method, setMethod] = useState<Method>("card")

    return (
        <>
            <PageHeader title="Checkout" image="/images/blog/hero_1.jpg.webp"
                breadcrumb={[{ title: "Home", to: "/" }, { title: "Cart", to: "/cart" }, { title: "Checkout" }]} />

            <div className="container py-5">
                <Steps current={count ? 2 : 0} />

                {count === 0 ?
                    <div className="alert alert-info d-flex flex-wrap align-items-center justify-content-between gap-3 mx-auto" style={{ maxWidth: "36rem" }}>
                        <span>Your cart is empty.</span>
                        <Link to="/courses" className="btn btn-sm btn-primary">Browse courses</Link>
                    </div> :
                    <form className="row g-4 g-xl-5 align-items-start" onSubmit={(e) => e.preventDefault()} noValidate>
                        <div className="col-12 col-lg-7 col-xl-8 d-grid gap-4">
                            <section className="card border-0 shadow-sm rounded-4">
                                <div className="card-body p-4">
                                    <div className="d-flex align-items-center justify-content-between mb-3">
                                        <h2 className="h5 fw-bold mb-0">Your details</h2>
                                        <Link to="/my-account/detail" className="small">Edit</Link>
                                    </div>
                                    <div className="row g-3">
                                        <div className="col-12 col-md-6">
                                            <label className="form-label small fw-medium" htmlFor="checkout-name">Full name</label>
                                            <input id="checkout-name" className="form-control" value={userInfo.name ?? ""} readOnly />
                                        </div>
                                        <div className="col-12 col-md-6">
                                            <label className="form-label small fw-medium" htmlFor="checkout-phone">Phone</label>
                                            <input id="checkout-phone" className="form-control" value={userInfo.phone ?? ""} readOnly />
                                        </div>
                                        <div className="col-12">
                                            <label className="form-label small fw-medium" htmlFor="checkout-email">Email</label>
                                            <input id="checkout-email" className="form-control" value={userInfo.email ?? ""} readOnly />
                                            <div className="form-text">Your receipt will be sent to this email.</div>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <section className="card border-0 shadow-sm rounded-4">
                                <div className="card-body p-4">
                                    <h2 className="h5 fw-bold mb-3">Payment method</h2>
                                    <div className="row g-3" role="radiogroup" aria-label="Payment method">
                                        {METHODS.map(option => (
                                            <div className="col-12 col-md-6" key={option.value}>
                                                <label className={`checkout-method card h-100 rounded-4 ${method === option.value ? "border-primary bg-primary-subtle" : ""}`} htmlFor={`method-${option.value}`}>
                                                    <span className="card-body d-flex align-items-center gap-3">
                                                        <input className="form-check-input mt-0 flex-shrink-0" type="radio" name="method" id={`method-${option.value}`}
                                                            value={option.value} checked={method === option.value} onChange={() => setMethod(option.value)} />
                                                        <span className="d-inline-flex align-items-center justify-content-center rounded-3 bg-body text-primary-emphasis fs-5 p-2 lh-1 flex-shrink-0">{option.icon}</span>
                                                        <span>
                                                            <span className="d-block fw-semibold text-body-emphasis">{option.label}</span>
                                                            <span className="d-block small text-body-secondary">{option.hint}</span>
                                                        </span>
                                                    </span>
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </section>

                            <div>
                                <Link to="/cart" className="btn btn-link px-0 d-inline-flex align-items-center gap-2 text-decoration-none">
                                    <FaArrowLeft /> Back to cart
                                </Link>
                            </div>
                        </div>

                        <div className="col-12 col-lg-5 col-xl-4">
                            <div className="sticky-lg-top" style={{ top: "6rem" }}>
                                <CartSummary subtotal={subtotal} savings={savings} total={total} count={count}>
                                    <ul className="list-unstyled d-grid gap-3 border-top pt-3 mt-3 mb-0">
                                        {items.map(item => (
                                            <li key={item._id} className="d-flex align-items-center gap-3">
                                                <span className="flex-shrink-0 rounded-2 overflow-hidden" style={{ width: 72 }}><CourseCover cover={item.cover} /></span>
                                                <span className="small fw-medium text-body-emphasis flex-grow-1 text-truncate">{item.name}</span>
                                                <span className="small text-nowrap">{item.price === 0 ? "Free" : money(finalPrice(item))}</span>
                                            </li>
                                        ))}
                                    </ul>
                                    <div className="form-check mt-4">
                                        <input className="form-check-input" type="checkbox" id="checkout-terms" />
                                        <label className="form-check-label small" htmlFor="checkout-terms">I agree to the terms of use</label>
                                    </div>
                                    <button type="submit" className="btn btn-primary btn-lg w-100 rounded-pill mt-3" disabled>
                                        Pay {money(total)}
                                    </button>
                                    <p className="small text-body-secondary d-flex align-items-start gap-2 mt-3 mb-0">
                                        <FaCircleInfo className="flex-shrink-0 mt-1" /> Online payment will be available soon.
                                    </p>
                                </CartSummary>
                            </div>
                        </div>
                    </form>}
            </div>
        </>
    )
}
