import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import ReCAPTCHA from "react-google-recaptcha"
import { FaShieldHalved } from "react-icons/fa6"
import useTheme from "../../hooks/useTheme"

/* Card shell shared by the login and register forms */
export default function AuthCard({ title, subtitle, switchText, switchLabel, switchTo, children }) {
    return (
        <section className="container py-5">
            <div className="row justify-content-center">
                <div className="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-5">
                    <div className="card shadow">
                        <div className="card-body p-3 p-sm-4 p-lg-5">
                            <div className="text-center mb-4">
                                <h2 className="h4 fw-bold mb-1">{title}</h2>
                                <p className="text-body-secondary mb-0">{subtitle}</p>
                            </div>

                            {children}

                            <p className="text-center small text-body-secondary mt-4 mb-0">
                                {switchText} <Link to={switchTo} className="fw-medium">{switchLabel}</Link>
                            </p>
                        </div>
                        <div className="card-footer small text-body-secondary d-flex gap-2 py-3">
                            <FaShieldHalved className="text-primary flex-shrink-0 mt-1" />
                            We respect your privacy. Log out on shared devices after use.
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

/* reCAPTCHA in the site theme; the compact widget fits narrow phones */
export function Captcha({ onChange }) {
    const [theme] = useTheme()
    const [compact, setCompact] = useState(() => window.matchMedia("(max-width: 399.98px)").matches)

    useEffect(() => {
        const media = window.matchMedia("(max-width: 399.98px)")
        const update = (e) => setCompact(e.matches)
        media.addEventListener("change", update)
        return () => media.removeEventListener("change", update)
    }, [])

    return (
        <div className="d-flex justify-content-center">
            <ReCAPTCHA
                key={`${theme}-${compact}`}
                theme={theme}
                size={compact ? "compact" : "normal"}
                sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
                onChange={onChange} />
        </div>
    )
}
