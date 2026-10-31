import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { useQueryClient } from "@tanstack/react-query"
import { FaArrowRight, FaClock, FaTags } from "react-icons/fa6"
import { useActiveCampaign } from "./hooks"
import { timeLeft } from "../../utils/timeLeft"
export default function SiteWideBanner() {
    const { data: campaign } = useActiveCampaign()
    const queryClient = useQueryClient()
    const [now, setNow] = useState(() => Date.now())

    useEffect(() => {
        if (!campaign) return
        const timer = setInterval(() => setNow(Date.now()), 30000)
        return () => clearInterval(timer)
    }, [campaign])

    const left = campaign ? timeLeft(campaign.endsAt, now) : null

    useEffect(() => {
        if (campaign && !left) {
            queryClient.invalidateQueries({ queryKey: ["campaign"] })
            queryClient.invalidateQueries({ queryKey: ["courses"] })
        }
    }, [campaign, left, queryClient])

    if (!campaign || !left) return null

    return (
        <div className="bg-danger text-white">
            <div className="container py-2 d-flex flex-wrap align-items-center justify-content-center gap-2 gap-sm-3 small fw-medium">
                <FaTags />
                <span>{campaign.percent}% off every course</span>
                <span className="d-inline-flex align-items-center gap-1 bg-white bg-opacity-25 rounded-pill px-2 py-1">
                    <FaClock /> Ends in {left}
                </span>
                <Link to="/courses" className="btn btn-sm btn-light rounded-pill px-3 py-0 d-inline-flex align-items-center gap-1 fw-semibold">
                    Shop now <FaArrowRight />
                </Link>
            </div>
        </div>
    )
}
