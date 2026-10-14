import { useState } from 'react'
import Button from '../../modules/Form/Button'
import { requiredValidator, minValidator, maxValidator } from '../../../validators/rules'
import Input from '../../modules/Form/Input'
import { Link } from 'react-router-dom';
import ReCAPTCHA from "react-google-recaptcha";
import useTheme from '../../../Hooks/useTheme';


export default function LoginMain({ formState, changeInputHandeler, loginUser }) {
    const [isRecapchaVerified, setIsRecapchaVerified] = useState(false)
    const [theme] = useTheme()

    const onChange = () => {
        setIsRecapchaVerified(true)
    }

    const { username, password } = formState.inputs
    const canSubmit = formState.isFormValid && isRecapchaVerified

    return (
        <section className='auth-section'>
            <div className="container">
                <div className="card auth-card mx-auto">
                    <div className="card-body p-4 p-sm-5">
                        <div className="text-center mb-4">
                            <h1 className="h4 mb-1">Login in to your account</h1>
                            <p className="text-body-secondary mb-0">Welcome to ACADEMIA :)</p>
                        </div>

                        <div className="auth-switch mb-4">
                            <span>Are you new user?</span>
                            <Link to={"/register"} className="btn btn-sm btn-primary">register</Link>
                        </div>

                        <form action="#" className="d-flex flex-column gap-3" onSubmit={(e) => e.preventDefault()}>
                            <div className="input-icon">
                                <Input
                                    isValid={username.isValid}
                                    placeholder="Email or Username"
                                    type="input"
                                    onChangeInput={(e) => changeInputHandeler(e, "username", [
                                        requiredValidator(),
                                        maxValidator(20),
                                    ])}
                                />
                                <i className="fa fa-user input-icon__icon"></i>
                            </div>

                            <div className="input-icon">
                                <Input
                                    isValid={password.isValid}
                                    placeholder="Password"
                                    type="input"
                                    inputType="password"
                                    onChangeInput={(e) => changeInputHandeler(e, "password", [
                                        requiredValidator(),
                                        maxValidator(18),
                                        minValidator(8),
                                    ])}
                                />
                                <i className="fa fa-lock input-icon__icon"></i>
                            </div>

                            <div className="recaptcha-wrap">
                                <ReCAPTCHA
                                    key={theme}
                                    theme={theme}
                                    sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
                                    onChange={onChange}
                                />
                            </div>

                            <Button
                                type="submit"
                                disabled={!formState.isFormValid && !isRecapchaVerified}
                                actionForm={(e) => loginUser(e)}
                                className={`btn btn-lg w-100 d-flex align-items-center justify-content-center gap-2 ${canSubmit ? "btn-primary" : "btn-secondary"}`}>
                                <i className="fas fa-sign-in-alt"></i>
                                <span>Login</span>
                            </Button>

                            <div className="d-flex flex-wrap justify-content-between gap-2 small">
                                <div className="form-check mb-0">
                                    <input type="checkbox" className="form-check-input" id="remember-login" />
                                    <label className="form-check-label text-body-secondary" htmlFor="remember-login">Remember me</label>
                                </div>
                                <Link to="#" className="text-body-secondary">Do you forget your password?</Link>
                            </div>
                        </form>

                        <hr className="my-4" />
                        <ul className="auth-notes">
                            <li>We respect your privacy.Your information is safe With us.</li>
                            <li>Change your password preodically for better security.</li>
                            <li>Log out from public or shared device after use.</li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    )
}
