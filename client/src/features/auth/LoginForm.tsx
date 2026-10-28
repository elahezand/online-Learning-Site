import { useState } from "react"
import { Link } from "react-router-dom"
import { FaArrowRight, FaEye, FaEyeSlash, FaLock, FaShieldHalved, FaTriangleExclamation, FaUser } from "react-icons/fa6"
import Input from "../../components/ui/Input"
import type { SubmitHandler, UseFormReturn } from "react-hook-form"
import type { LoginData, LoginFormValues } from "../../validators"
import AuthCard, { Captcha } from "./AuthCard"

interface LoginFormProps {
    form: UseFormReturn<LoginFormValues, unknown, LoginData>
    onSubmit: SubmitHandler<LoginData>
    isSubmitting: boolean
}

export default function LoginForm({ form, onSubmit, isSubmitting }: LoginFormProps) {
    const [isCaptchaVerified, setIsCaptchaVerified] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [capsLock, setCapsLock] = useState(false)
    const { register, handleSubmit, formState: { errors, isValid } } = form

    const checkCapsLock = (e: React.KeyboardEvent<HTMLInputElement>) => setCapsLock(e.getModifierState("CapsLock"))

    return (
        <AuthCard title="Log in to your account" subtitle="Welcome back to ACADEMIA"
            switchText="New to ACADEMIA?" switchLabel="Create an account" switchTo="/register">
            <form className="d-grid gap-3" onSubmit={handleSubmit(onSubmit)} noValidate>
                <div>
                    <label className="form-label small fw-semibold text-uppercase text-body-secondary" htmlFor="login-username">Email or username</label>
                    <div className="input-group input-group-lg has-validation">
                        <span className="input-group-text bg-body-tertiary border-end-0 text-primary ps-3"><FaUser /></span>
                        <Input id="login-username" className="bg-body-tertiary border-start-0 ps-1" placeholder="you@example.com" autoComplete="username"
                            {...register("username")} error={errors.username?.message} />
                    </div>
                </div>

                <div>
                    <div className="d-flex justify-content-between align-items-baseline">
                        <label className="form-label small fw-semibold text-uppercase text-body-secondary" htmlFor="login-password">Password</label>
                        <Link to="/forgot-password" className="small link-primary link-underline-opacity-0 link-underline-opacity-100-hover">Forgot?</Link>
                    </div>
                    <div className="input-group input-group-lg has-validation">
                        <span className="input-group-text bg-body-tertiary border-end-0 text-primary ps-3"><FaLock /></span>
                        <Input id="login-password" className="bg-body-tertiary border-start-0 border-end-0 ps-1" type={showPassword ? "text" : "password"} placeholder="••••••••" autoComplete="current-password"
                            onKeyUp={checkCapsLock} onKeyDown={checkCapsLock}
                            {...register("password")} error={errors.password?.message} />
                        <button type="button" className="btn bg-body-tertiary border border-start-0 text-body-secondary pe-3" onClick={() => setShowPassword(value => !value)}
                            aria-label={showPassword ? "Hide password" : "Show password"}>
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>
                    {capsLock &&
                        <div className="small text-warning-emphasis d-flex align-items-center gap-1 mt-2">
                            <FaTriangleExclamation /> Caps Lock is on
                        </div>}
                </div>

                <div className="form-check form-switch">
                    <input type="checkbox" className="form-check-input" role="switch" id="remember-login" />
                    <label className="form-check-label small text-body-secondary" htmlFor="remember-login">Keep me signed in</label>
                </div>

                <Captcha onChange={() => setIsCaptchaVerified(true)} />

                <button type="submit" className="btn btn-primary btn-lg rounded-pill d-flex align-items-center justify-content-between ps-4 pe-2 py-2 shadow-sm"
                    disabled={!isValid || !isCaptchaVerified || isSubmitting}>
                    <span className="fw-semibold">{isSubmitting ? "Logging in..." : "Log in"}</span>
                    <span className="d-inline-flex align-items-center justify-content-center rounded-circle bg-white text-primary"
                        style={{ width: "2.5rem", height: "2.5rem" }}>
                        {isSubmitting ? <span className="spinner-border spinner-border-sm" aria-hidden="true" /> : <FaArrowRight />}
                    </span>
                </button>

                <p className="small text-body-secondary text-center d-flex align-items-center justify-content-center gap-2 mb-0">
                    <FaShieldHalved className="text-success" /> Your connection is encrypted and secure
                </p>
            </form>
        </AuthCard>
    )
}