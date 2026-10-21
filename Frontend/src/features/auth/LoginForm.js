import { useState } from "react"
import { Link } from "react-router-dom"
import { FaLock, FaRightToBracket, FaUser } from "react-icons/fa6"
import Input from "../../components/ui/Input"
import AuthCard, { Captcha } from "./AuthCard"

export default function LoginForm({ form, onSubmit, isSubmitting }) {
    const [isCaptchaVerified, setIsCaptchaVerified] = useState(false)
    const { register, handleSubmit, formState: { errors, isValid } } = form

    return (
        <AuthCard title="Log in to your account" subtitle="Welcome back to ACADEMIA"
            switchText="New to ACADEMIA?" switchLabel="Create an account" switchTo="/register">
            <form className="d-grid gap-3" onSubmit={handleSubmit(onSubmit)} noValidate>
                <div className="input-group has-validation">
                    <span className="input-group-text"><FaUser /></span>
                    <Input placeholder="Email or username" aria-label="Email or username" autoComplete="username" {...register("username")} error={errors.username?.message} />
                </div>

                <div className="input-group has-validation">
                    <span className="input-group-text"><FaLock /></span>
                    <Input type="password" placeholder="Password" aria-label="Password" autoComplete="current-password" {...register("password")} error={errors.password?.message} />
                </div>

                <Captcha onChange={() => setIsCaptchaVerified(true)} />

                <button type="submit" className="btn btn-primary btn-lg d-inline-flex align-items-center justify-content-center gap-2"
                    disabled={(!isValid && !isCaptchaVerified) || isSubmitting}>
                    <FaRightToBracket /> Log in
                </button>

                <div className="d-flex flex-wrap justify-content-between gap-2 small">
                    <div className="form-check mb-0">
                        <input type="checkbox" className="form-check-input" id="remember-login" />
                        <label className="form-check-label text-body-secondary" htmlFor="remember-login">Remember me</label>
                    </div>
                    <Link to="#" className="link-secondary">Forgot your password?</Link>
                </div>
            </form>
        </AuthCard>
    )
}
