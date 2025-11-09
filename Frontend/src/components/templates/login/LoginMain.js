import { useState } from 'react'
import Button from '../../modules/Form/Button'
import { requiredValidator, minValidator, maxValidator } from '../../../validators/rules'
import Input from '../../modules/Form/Input'
import { Link } from 'react-router-dom';
import ReCAPTCHA from "react-google-recaptcha";


export default function LoginMain({ formState, changeInputHandeler, loginUser }) {
    const [isRecapchaVerified, setIsRecapchaVerified] = useState(false)

    const onChange = () => {
        console.log("Captcha value:verify shod");
        setIsRecapchaVerified(true)
    }


    const { username, password } = formState.inputs



    return (
        <div className='login-register'>

            <div className="login">
                <span className="login-title">Login in to your account</span>
                <span className="login-subtitle">
                    Welcome to ACADEMIA :)
                </span>

                <div className="login__new-member">
                    <span className="login__new-member-text">
                        Are you new user?
                    </span>
                    <Link to={"/register"} className="login__new-member-link">register</Link>
                </div>

                <form action="#" className="login-form">
                    <div className="login-form__username">
                        <Input
                            isValid={username.isValid}
                            className="login-form__username-input"
                            placeholder="Email or Username"
                            type="input"
                            onChangeInput={(e) => changeInputHandeler(e, "username", [
                                requiredValidator(),
                                maxValidator(20),
                            ])}



                        />
                        <i className="fa fa-user login-form__username-icon"></i>
                    </div>

                    <div className="login-form__password">
                        <Input
                            isValid={password.isValid}
                            className="login-form__password-input"
                            placeholder="Password"
                            type="input"
                            onChangeInput={(e) => changeInputHandeler(e, "password", [
                                requiredValidator(),
                                maxValidator(18),
                                minValidator(8),
                            ])}

                        />
                        <i className="fa fa-lock-open login-form__password-icon"></i>
                    </div>

                    <ReCAPTCHA
                        sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
                        onChange={onChange}
                    />

                    <Button disabled={!formState.isFormValid && !isRecapchaVerified} actionForm={(e) => loginUser(e)}
                        className={`register-form__btn ${formState.isFormValid && isRecapchaVerified ? "active" : null}`}>
                        <i className="fas fa-sign-out-alt login-form__btn-icon"></i>
                        <span className="login-form__btn-text">Login</span>
                    </Button>

                    <div className="login-form__password-setting">
                        <label className="login-form__password-remember">
                            <input type="checkbox" className="login-form__password-checkbox"></input>
                            <span className="login-form__password-text">Remember me</span>
                        </label>
                        <span className="login-form__password-forget-link">Do you forget your password?</span>
                    </div>
                </form>

                <div className="login-des">
                    <span className="login-des-title"></span>
                    <ul className="login-des-list">
                        <li className="login-des-item">
                            We respect your privacy.Your information is safe With us.
                        </li>
                        <li className="login-des-item">
                            Change your password preodically for better security.
                        </li>
                        <li className="login-des-item">
                            Log out from public or shared device after use.
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    )
}
