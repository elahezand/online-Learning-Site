import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useNavigate } from "react-router-dom"
import { FaBullhorn, FaPercent, FaPlay, FaStop } from "react-icons/fa6"
import Input from "../../components/ui/Input"
import FormCard from "../../components/ui/FormCard"
import { confirmToast } from "../../components/ui/toastActions"
import { siteWideDiscountSchema } from "../../validators"
import { useEndSiteWideDiscount, useSiteWideDiscount } from "../../features/discounts/hooks"
import type { SiteWideDiscountData } from "../../validators"

export default function SiteWideDiscount() {
    const navigate = useNavigate()
    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        resolver: zodResolver(siteWideDiscountSchema),
        defaultValues: { discount: "" },
        mode: "onTouched",
    })
    const siteWideDiscount = useSiteWideDiscount(() => navigate("/p-admin/discounts"))
    const endDiscount = useEndSiteWideDiscount(() => reset())
    const busy = siteWideDiscount.isPending || endDiscount.isPending

    const runCampaign = async ({ discount }: SiteWideDiscountData) => {
        const ok = await confirmToast({
            title: `Apply ${discount}% to every course?`,
            description: "All course prices on the site will change.",
            confirmLabel: "Run campaign",
            variant: "primary",
        })
        if (ok) siteWideDiscount.mutate({ discount })
    }

    const endCampaign = async () => {
        const ok = await confirmToast({
            title: "End the site-wide campaign?",
            description: "The discount will be removed from every course.",
            confirmLabel: "End campaign",
        })
        if (ok) endDiscount.mutate()
    }

    return (
        <FormCard icon={<FaBullhorn />} title="Run a Site-wide Campaign">
            <form className="d-grid gap-3" onSubmit={handleSubmit(runCampaign)} noValidate>
                <div className="row g-3">
                    <div className="col-12 col-md-6">
                        <div className="input-group has-validation">
                            <span className="input-group-text"><FaPercent /></span>
                            <Input type="number" min="1" max="100" placeholder="Discount percent" aria-label="Discount percent" {...register("discount")} error={errors.discount?.message} />
                        </div>
                    </div>
                </div>
                <div className="d-flex flex-wrap gap-2">
                    <button type="submit" className="btn btn-primary d-inline-flex align-items-center gap-2" disabled={busy}>
                        <FaPlay /> Run campaign
                    </button>
                    <button type="button" className="btn btn-outline-danger d-inline-flex align-items-center gap-2" disabled={busy} onClick={endCampaign}>
                        <FaStop /> End campaign
                    </button>
                </div>
            </form>
        </FormCard>
    )
}