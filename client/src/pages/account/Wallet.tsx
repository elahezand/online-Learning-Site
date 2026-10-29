import { Link } from "react-router-dom"
import { FaWallet } from "react-icons/fa6"
import { useAuth } from "../../features/auth/useAuth"
import { money } from "../../features/cart/cartStore"

export default function Wallet() {
    const { userInfo } = useAuth()
    const balance = userInfo.wallet?.balance ?? 0

    return (
        <>
            <h2 className="h4 fw-bold mb-3">My wallet</h2>
            <div className="card border-0 shadow-sm rounded-4 bg-primary bg-gradient text-white mb-4">
                <div className="card-body p-4 d-flex align-items-center gap-3">
                    <span className="d-inline-flex align-items-center justify-content-center rounded-circle bg-white bg-opacity-25 fs-3 p-3 lh-1">
                        <FaWallet />
                    </span>
                    <div>
                        <div className="small text-white text-opacity-75">Available balance</div>
                        <div className="display-6 fw-bold">{money(balance)}</div>
                    </div>
                </div>
            </div>

            {balance > 0 ?
                <p className="text-body-secondary mb-0">
                    You can use your balance at checkout. <Link to="/courses">Browse courses</Link>
                </p> :
                <div className="text-center border rounded-3 bg-body-tertiary py-5 px-3">
                    <p className="fw-medium mb-1">Your wallet is empty</p>
                    <p className="small text-body-secondary mb-0">Refunds will show up here.</p>
                </div>}
        </>
    )
}