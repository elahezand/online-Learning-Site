import { useEffect } from "react"
import { Link, useSearchParams } from "react-router-dom"
import { useQueryClient } from "@tanstack/react-query"
import { FaCircleCheck, FaCircleXmark } from "react-icons/fa6"
import { useAuth } from "../../features/auth/useAuth"

export default function PaymentResult({ success }: { success: boolean }) {
    const [params] = useSearchParams()
    const orderId = params.get("orderId")
    const queryClient = useQueryClient()
    const { refreshUser } = useAuth()

    useEffect(() => {
        refreshUser()
        if (!success) return
        queryClient.invalidateQueries({ queryKey: ["cart"] })
        queryClient.invalidateQueries({ queryKey: ["me"] })
    }, [success, queryClient, refreshUser])

    useEffect(() => {
        if (!success) return
        queryClient.invalidateQueries({ queryKey: ["cart"] })
        queryClient.invalidateQueries({ queryKey: ["me"] })
    }, [success, queryClient])

    return (
        <div className="container py-5">
            <div className="card border-0 shadow-sm rounded-4 text-center py-5 px-3 mx-auto" style={{ maxWidth: "36rem" }}>
                <span className={`d-inline-flex align-items-center justify-content-center rounded-circle fs-1 p-4 lh-1 mx-auto mb-4 ${success ? "bg-success-subtle text-success" : "bg-danger-subtle text-danger"}`}>
                    {success ? <FaCircleCheck /> : <FaCircleXmark />}
                </span>
                <h1 className="h4 fw-bold">{success ? "Payment successful" : "Payment failed"}</h1>
                <p className="text-body-secondary mb-1">
                    {success ? "Your courses are ready. Happy learning!" : "Your payment was not completed. Your cart is still waiting for you."}
                </p>
                {!success && <p className="small text-body-secondary">If money was taken from your account, it will be confirmed or returned automatically.</p>}
                {orderId && <p className="small text-body-secondary">Order #{orderId.slice(-6).toUpperCase()}</p>}
                <div className="d-flex flex-wrap justify-content-center gap-2 mt-4">
                    {success ?
                        <>
                            <Link to="/my-account/courses" className="btn btn-primary rounded-pill px-4">My courses</Link>
                            <Link to="/my-account/orders" className="btn btn-outline-secondary rounded-pill px-4">My orders</Link>
                        </> :
                        <>
                            <Link to="/cart" className="btn btn-primary rounded-pill px-4">Back to cart</Link>
                            <Link to="/my-account/orders" className="btn btn-outline-secondary rounded-pill px-4">My orders</Link>
                        </>}
                </div>
            </div>
        </div>
    )
}