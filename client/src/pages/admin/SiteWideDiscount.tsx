import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useNavigate } from "react-router-dom"
import { FaBullhorn, FaCalendar, FaPercent, FaPlay, FaStop } from "react-icons/fa6"
import Input from "../../components/ui/Input"
import FormCard from "../../components/ui/FormCard"
import { confirmToast } from "../../components/ui/toastActions"
import { siteWideDiscountSchema } from "../../validators"
import { useActiveCampaign, useEndSiteWideDiscount, useSiteWideDiscount } from "../../features/discounts/hooks"
import type { SiteWideDiscountData } from "../../validators"
import { timeLeft } from "../../utils/timeLeft"
const formatDate = (value: string) =>
    new Date(value).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })

export default function SiteWideDiscount() {
    const navigate = useNavigate()
    const { data: campaign, isLoading } = useActiveCampaign()
    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        resolver: zodResolver(siteWideDiscountSchema),
        defaultValues: { percent: "", endsAt: "" },
        mode: "onTouched",
    })
    const siteWideDiscount = useSiteWideDiscount(() => navigate("/p-admin/discounts"))
    const endDiscount = useEndSiteWideDiscount(() => reset())
    const busy = siteWideDiscount.isPending || endDiscount.isPending

    const runCampaign = async ({ percent, endsAt }: SiteWideDiscountData) => {
        const ok = await confirmToast({
            title: `Apply ${percent}% to every course?`,
            description: `Runs until ${formatDate(endsAt)}. Courses with a bigger discount keep theirs, and every course gets its old discount back when the campaign ends.`,
            confirmLabel: "Run campaign",
            variant: "primary",
        })
        if (ok) siteWideDiscount.mutate({ percent, endsAt })
    }

    const endCampaign = async () => {
        const ok = await confirmToast({
            title: "End the campaign now?",
            description: "Every course gets back the discount it had before the campaign.",
            confirmLabel: "End campaign",
        })
        if (ok) endDiscount.mutate()
    }

    if (isLoading) {
        return <div className="text-center py-5"><div className="spinner-border text-primary" role="status" /></div>
    }

    return (
        <FormCard icon={<FaBullhorn />} title="Site-wide Campaign">
            {campaign ?
                <div className="d-grid gap-3">
                    <div className="alert alert-success d-flex flex-wrap align-items-center justify-content-between gap-2 mb-0">
                        <div>
                            <div className="fw-bold">{campaign.percent}% off every course is running</div>
                            <div className="small">Ends {formatDate(campaign.endsAt)}{timeLeft(campaign.endsAt) ? ` · ${timeLeft(campaign.endsAt)} left` : ""}</div>
                        </div>
                        <button type="button" className="btn btn-outline-danger d-inline-flex align-items-center gap-2" disabled={busy} onClick={endCampaign}>
                            <FaStop /> End now
                        </button>
                    </div>
                    <p className="small text-body-secondary mb-0">It ends by itself at the end date. You can start a new campaign after this one ends.</p>
                </div> :
                <form className="d-grid gap-3" onSubmit={handleSubmit(runCampaign)} noValidate>
                    <div className="row g-3">
                        <div className="col-12 col-md-6">
                            <label className="form-label small fw-medium" htmlFor="campaign-percent">Discount</label>
                            <div className="input-group has-validation">
                                <span className="input-group-text"><FaPercent /></span>
                                <Input id="campaign-percent" type="number" min="1" max="100" placeholder="e.g. 30" {...register("percent")} error={errors.percent?.message} />
                            </div>
                        </div>
                        <div className="col-12 col-md-6">
                            <label className="form-label small fw-medium" htmlFor="campaign-ends">Ends at</label>
                            <div className="input-group has-validation">
                                <span className="input-group-text"><FaCalendar /></span>
                                <Input id="campaign-ends" type="datetime-local" {...register("endsAt")} error={errors.endsAt?.message} />
                            </div>
                        </div>
                    </div>
                    <div>
                        <button type="submit" className="btn btn-primary d-inline-flex align-items-center gap-2" disabled={busy}>
                            <FaPlay /> Run campaign
                        </button>
                    </div>
                </form>}
        </FormCard>
    )
}
