import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { FaArrowLeft, FaCreditCard, FaWallet } from "react-icons/fa6"
import PageHeader from "../../components/ui/PageHeader"
import { CourseCover } from "../../features/courses/CourseCard"
import CartSummary from "../../features/cart/CartSummary"
import { useCheckout, useGetMyCart } from "../../features/cart/hook"
import { useAuth } from "../../features/auth/useAuth"
import { getCheckoutKey } from "../../utils/idempotencyKey"

const STEPS = ["Cart", "Details", "Payment"]

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
    const navigate = useNavigate()
    const { userInfo } = useAuth()
    const { data: cart, isLoading } = useGetMyCart()
    const items = cart?.items ?? []
    const pricing = cart?.pricing

    const checkout = useCheckout(cart?._id, (orderId) => {
        navigate(`/payment-success${orderId ? `?orderId=${orderId}` : ""}`, { replace: true })
    })

    const [useWallet, setUseWallet] = useState(false)
    const [agreed, setAgreed] = useState(false)

    const walletBalance = userInfo.wallet?.balance ?? 0
    const total = pricing?.total ?? 0
    const walletPart = useWallet ? Math.min(walletBalance, total) : 0
    const leftToPay = total - walletPart

    const submit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!agreed || !cart) return
        checkout.mutate({
            paymentMethod: "zarinpal",
            useWallet,
            idempotencyKey: getCheckoutKey(cart._id),
        })
    }

    return (
        <>
            <PageHeader title="Checkout" image="/images/blog/hero_1.jpg.webp"
                breadcrumb={[{ title: "Home", to: "/" }, { title: "Cart", to: "/cart" }, { title: "Checkout" }]} />

            <div className="container py-5">
                <Steps current={items.length ? 2 : 0} />

                {isLoading ? null : items.length === 0 ?
                    <div className="alert alert-info d-flex flex-wrap align-items-center justify-content-between gap-3 mx-auto" style={{ maxWidth: "36rem" }}>
                        <span>Your cart is empty.</span>
                        <Link to="/courses" className="btn btn-sm btn-primary">Browse courses</Link>
                    </div> :
                    <form className="row g-4 g-xl-5 align-items-start" onSubmit={submit} noValidate>
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
                                <div className="card-body p-4 d-grid gap-3">
                                    <h2 className="h5 fw-bold mb-0">Payment</h2>

                                    {leftToPay > 0 &&
                                        <div className="checkout-method card rounded-4 border-primary bg-primary-subtle">
                                            <span className="card-body d-flex align-items-center gap-3">
                                                <span className="d-inline-flex align-items-center justify-content-center rounded-3 bg-body text-primary-emphasis fs-5 p-2 lh-1 flex-shrink-0"><FaCreditCard /></span>
                                                <span>
                                                    <span className="d-block fw-semibold text-body-emphasis">Online payment</span>
                                                    <span className="d-block small text-body-secondary">Pay with your bank card</span>
                                                </span>
                                            </span>
                                        </div>}

                                    {walletBalance > 0 &&
                                        <label className={`checkout-method card rounded-4 ${useWallet ? "border-primary bg-primary-subtle" : ""}`} htmlFor="checkout-wallet">
                                            <span className="card-body d-flex align-items-center gap-3">
                                                <input className="form-check-input mt-0 flex-shrink-0" type="checkbox" id="checkout-wallet"
                                                    checked={useWallet} onChange={(e) => setUseWallet(e.target.checked)} />
                                                <span className="d-inline-flex align-items-center justify-content-center rounded-3 bg-body text-primary-emphasis fs-5 p-2 lh-1 flex-shrink-0"><FaWallet /></span>
                                                <span>
                                                    <span className="d-block fw-semibold text-body-emphasis">Use wallet balance</span>
                                                    <span className="d-block small text-body-secondary">{walletBalance.toLocaleString()} $ available</span>
                                                </span>
                                            </span>
                                        </label>}

                                    {useWallet &&
                                        <div className="small d-grid gap-1">
                                            <div className="d-flex justify-content-between text-body-secondary">
                                                <span>Paid from wallet</span>
                                                <span>-{walletPart.toLocaleString()} $</span>
                                            </div>
                                            <div className="d-flex justify-content-between fw-bold">
                                                <span>Left to pay</span>
                                                <span>{leftToPay.toLocaleString()} $</span>
                                            </div>
                                            {leftToPay === 0 && <span className="text-success fw-semibold">Your wallet covers this order — no online payment needed.</span>}
                                        </div>}
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
                                <CartSummary subtotal={pricing?.subtotal ?? 0} savings={pricing?.discount ?? 0} total={total} count={items.length}>
                                    <ul className="list-unstyled d-grid gap-3 border-top pt-3 mt-3 mb-0">
                                        {items.map(item => (
                                            <li key={item.course._id} className="d-flex align-items-center gap-3">
                                                <span className="flex-shrink-0 rounded-2 overflow-hidden" style={{ width: 72 }}><CourseCover cover={item.course.cover} /></span>
                                                <span className="small fw-medium text-body-emphasis flex-grow-1 text-truncate">{item.course.name}</span>
                                                <span className="small text-nowrap">{item.finalPrice === 0 ? "Free" : `${item.finalPrice.toLocaleString()} $`}</span>
                                            </li>
                                        ))}
                                    </ul>
                                    <div className="form-check mt-4">
                                        <input className="form-check-input" type="checkbox" id="checkout-terms"
                                            checked={agreed} onChange={(e) => setAgreed(e.target.checked)} />
                                        <label className="form-check-label small" htmlFor="checkout-terms">I agree to the terms of use</label>
                                    </div>
                                    <button type="submit" className="btn btn-primary btn-lg w-100 rounded-pill mt-3"
                                        disabled={!agreed || checkout.isPending}>
                                        {checkout.isPending ? "Processing..." : leftToPay ? `Pay ${leftToPay.toLocaleString()} $` : "Place order"}
                                    </button>
                                </CartSummary>
                            </div>
                        </div>
                    </form>}
            </div>
        </>
    )
}