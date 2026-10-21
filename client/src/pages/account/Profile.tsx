import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { FaFloppyDisk } from "react-icons/fa6"
import Input from "../../components/ui/Input"
import { confirmToast } from "../../components/ui/toastActions"
import { profileSchema } from "../../validators"
import type { ProfileData, ProfileFormValues } from "../../validators"
import { useAuth } from "../../features/auth/useAuth"
import { useUpdateMe } from "../../features/users/hooks"

const defaultValues: ProfileFormValues = { name: "", username: "", email: "", phone: "", password: "", confirmPassword: "" }

const fields: { name: "name" | "username" | "email" | "phone"; label: string; type?: string; autoComplete: string }[] = [
    { name: "name", label: "Full name", autoComplete: "name" },
    { name: "username", label: "Username", autoComplete: "username" },
    { name: "email", label: "Email", type: "email", autoComplete: "email" },
    { name: "phone", label: "Phone number", type: "tel", autoComplete: "tel" },
]

export default function Profile() {
    const { userInfo } = useAuth()
    const { register, handleSubmit, reset, resetField, formState: { errors, isDirty } } = useForm({
        resolver: zodResolver(profileSchema),
        defaultValues,
        mode: "onTouched",
    })
    const updateMe = useUpdateMe(() => {
        resetField("password")
        resetField("confirmPassword")
    })

    useEffect(() => {
        if (!userInfo) return
        reset({
            ...defaultValues,
            name: userInfo.name ?? "",
            username: userInfo.username ?? "",
            email: userInfo.email ?? "",
            phone: userInfo.phone ?? "",
        })
    }, [userInfo, reset])

    const save = async ({ confirmPassword: _confirm, password, ...data }: ProfileData) => {
        const ok = await confirmToast({ title: "Save your changes?", confirmLabel: "Save", variant: "primary" })
        if (ok) updateMe.mutate({ ...data, ...(password ? { password } : {}) })
    }

    return (
        <>
            <h2 className="h4 fw-bold mb-4">Account details</h2>
            <form className="d-flex flex-column gap-4" onSubmit={handleSubmit(save)} noValidate>
                <fieldset className="row g-3">
                    {fields.map(field => (
                        <div className="col-12 col-md-6" key={field.name}>
                            <label className="form-label" htmlFor={`detail-${field.name}`}>{field.label} *</label>
                            <Input id={`detail-${field.name}`} type={field.type ?? "text"} autoComplete={field.autoComplete}
                                {...register(field.name)} error={errors[field.name]?.message} />
                        </div>
                    ))}
                </fieldset>

                <fieldset className="row g-3">
                    <legend className="h6 fw-bold text-primary-emphasis border-bottom pb-2 mb-1">Change your password</legend>
                    <div className="col-12 col-md-6">
                        <label className="form-label" htmlFor="detail-password">New password</label>
                        <Input id="detail-password" type="password" autoComplete="new-password" placeholder="Leave empty to keep it"
                            {...register("password", { deps: ["confirmPassword"] })} error={errors.password?.message} />
                    </div>
                    <div className="col-12 col-md-6">
                        <label className="form-label" htmlFor="detail-confirm">Repeat new password</label>
                        <Input id="detail-confirm" type="password" autoComplete="new-password"
                            {...register("confirmPassword")} error={errors.confirmPassword?.message} />
                    </div>
                </fieldset>

                <div>
                    <button className="btn btn-primary d-inline-flex align-items-center gap-2 px-4" type="submit" disabled={!isDirty || updateMe.isPending}>
                        <FaFloppyDisk /> Save changes
                    </button>
                </div>
            </form>
        </>
    )
}
