import { FaWallet } from "react-icons/fa6"

export default function Wallet() {
    return (
        <>
            <h2 className="h4 fw-bold mb-3">My wallet</h2>
            <div className="text-center border rounded-3 bg-body-tertiary py-5 px-3">
                <FaWallet className="fs-1 text-body-tertiary mb-3" />
                <p className="fw-medium mb-1">Your wallet is empty</p>
                <p className="small text-body-secondary mb-0">Top-ups and refunds will show up here.</p>
            </div>
        </>
    )
}
