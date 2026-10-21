import { useState } from "react"
import { FaEnvelope, FaIdCard, FaLock, FaPhone, FaUser, FaUserPlus } from "react-icons/fa6"
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
    placeholder: string
    icon: ReactNode
    type?: string
    autoComplete: string
}

const fields: Field[] = [
    { name: "username", placeholder: "Username", icon: <FaUser />, autoComplete: "username" },
    { name: "name", placeholder: "Full name", icon: <FaIdCard />, autoComplete: "name" },
    { name: "email", placeholder: "Email address", icon: <FaEnvelope />, type: "email", autoComplete: "email" },
    { name: "phonenumber", placeholder: "Phone number", icon: <FaPhone />, type: "tel", autoComplete: "tel" },
    { name: "password", placeholder: "Password", icon: <FaLock />, type: "password", autoComplete: "new-password" },
]

export default function RegisterForm({ form, onSubmit, isSubmitting }: RegisterFormProps) {
    const [isCaptchaVerified, setIsCaptchaVerified] = useState(false)
    const { register, handleSubmit, formState: { errors, isValid } } = form

    return (
        <AuthCard title="Create your account" subtitle="It takes less than a minute"
            switchText="Already have an account?" switchLabel="Log in" switchTo="/login">
            <form className="d-grid gap-3" onSubmit={handleSubmit(onSubmit)} noValidate>
                {fields.map(field => (
                    <div className="input-group has-validation" key={field.name}>
                        <span className="input-group-text">{field.icon}</span>
                        <Input type={field.type ?? "text"} placeholder={field.placeholder} aria-label={field.placeholder}
                            autoComplete={field.autoComplete} {...register(field.name)} error={errors[field.name]?.message} />
                    </div>
                ))}

                <Captcha onChange={() => setIsCaptchaVerified(true)} />

                <button type="submit" className="btn btn-primary btn-lg d-inline-flex align-items-center justify-content-center gap-2"
                    disabled={(!isValid && !isCaptchaVerified) || isSubmitting}>
                    <FaUserPlus /> Sign up
                </button>
            </form>
        </AuthCard>
    )
}
