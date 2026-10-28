import { useState } from "react"
import { FaArrowRight, FaEnvelope, FaEye, FaEyeSlash, FaIdCard, FaLock, FaPhone, FaShieldHalved, FaTriangleExclamation, FaUser } from "react-icons/fa6"
import Input from "../../components/ui/Input"
import type { ReactNode } from "react"
import type { SubmitHandler, UseFormReturn } from "react-hook-form"
import type { RegisterData, RegisterFormValues } from "../../validators"
import AuthCard, { Captcha } from "./AuthCard"

interface RegisterFormProps {
    form: UseFormReturn<RegisterFormValues, unknown, RegisterData>
    onSubmit: SubmitHandler<RegisterData>
    isSubmitting: boolean
}

interface Field {
    name: keyof RegisterFormValues
    label: string
    placeholder: string
    icon: ReactNode
    type?: string
    autoComplete: string
    half?: boolean
}

const fields: Field[] = [
    { name: "username", label: "Username", placeholder: "johndoe", icon: <FaUser />, autoComplete: "username", half: true },
    { name: "name", label: "Full name", placeholder: "John Doe", icon: <FaIdCard />, autoComplete: "name", half: true },
    { name: "email", label: "Email", placeholder: "you@example.com", icon: <FaEnvelope />, type: "email", autoComplete: "email" },
    { name: "phonenumber", label: "Phone", placeholder: "0912 345 6789", icon: <FaPhone />, type: "tel", autoComplete: "tel" },
]

const labelClass = "form-label small fw-semibold text-uppercase text-body-secondary"
const iconClass = "input-group-text bg-body-tertiary border-end-0 text-primary ps-3"

export default function RegisterForm({ form, onSubmit, isSubmitting }: RegisterFormProps) {
    const [isCaptchaVerified, setIsCaptchaVerified] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [capsLock, setCapsLock] = useState(false)
    const { register, handleSubmit, formState: { errors, isValid } } = form

    const checkCapsLock = (e: React.KeyboardEvent<HTMLInputElement>) => setCapsLock(e.getModifierState("CapsLock"))

    return (
        <AuthCard title="Create your account" subtitle="It takes less than a minute"
            switchText="Already have an account?" switchLabel="Log in" switchTo="/login">
            <form className="row g-3" onSubmit={handleSubmit(onSubmit)} noValidate>
                {fields.map(field => (
                    <div className={field.half ? "col-12 col-sm-6" : "col-12"} key={field.name}>
                        <label className={labelClass} htmlFor={`register-${field.name}`}>{field.label}</label>
                        <div className="input-group input-group-lg has-validation">
                            <span className={iconClass}>{field.icon}</span>
                            <Input id={`register-${field.name}`} className="bg-body-tertiary border-start-0 ps-1"
                                type={field.type ?? "text"} placeholder={field.placeholder} autoComplete={field.autoComplete}
                                {...register(field.name)} error={errors[field.name]?.message} />
                        </div>
                    </div>
                ))}

                <div className="col-12">
                    <label className={labelClass} htmlFor="register-password">Password</label>
                    <div className="input-group input-group-lg has-validation">
                        <span className={iconClass}><FaLock /></span>
                        <Input id="register-password" className="bg-body-tertiary border-start-0 border-end-0 ps-1"
                            type={showPassword ? "text" : "password"} placeholder="At least 8 characters" autoComplete="new-password"
                            onKeyUp={checkCapsLock} onKeyDown={checkCapsLock}
                            {...register("password")} error={errors.password?.message} />
                        <button type="button" className="btn bg-body-tertiary border border-start-0 text-body-secondary pe-3"
                            onClick={() => setShowPassword(value => !value)} aria-label={showPassword ? "Hide password" : "Show password"}>
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>
                    {capsLock &&
                        <div className="small text-warning-emphasis d-flex align-items-center gap-1 mt-2">
                            <FaTriangleExclamation /> Caps Lock is on
                        </div>}
                </div>

                <div className="col-12">
                    <Captcha onChange={() => setIsCaptchaVerified(true)} />
                </div>

                <div className="col-12">
                    <button type="submit" className="btn btn-primary btn-lg rounded-pill w-100 d-flex align-items-center justify-content-between ps-4 pe-2 py-2 shadow-sm"
                        disabled={!isValid || !isCaptchaVerified || isSubmitting}>
                        <span className="fw-semibold">{isSubmitting ? "Creating account..." : "Create account"}</span>
                        <span className="d-inline-flex align-items-center justify-content-center rounded-circle bg-white text-primary"
                            style={{ width: "2.5rem", height: "2.5rem" }}>
                            {isSubmitting ? <span className="spinner-border spinner-border-sm" aria-hidden="true" /> : <FaArrowRight />}
                        </span>
                    </button>
                </div>

                <p className="col-12 small text-body-secondary text-center d-flex align-items-center justify-content-center gap-2 mb-0">
                    <FaShieldHalved className="text-success" /> Your information is encrypted and secure
                </p>
            </form>
        </AuthCard>
    )
}