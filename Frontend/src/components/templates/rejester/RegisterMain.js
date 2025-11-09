import { useState } from 'react'
import {
    emailValidator, requiredValidator,
    phoneValidator, maxValidator, minValidator
} from '../../../validators/rules.js';
import Input from '../../modules/Form/Input.js';
import Button from '../../modules/Form/Button.js';
import ReCAPTCHA from "react-google-recaptcha";



export default function RegisterMain({ formState, changeInputHandeler, registerNewUser }) {

    const [isRecapchaVerified, setIsRecapchaVerified] = useState(false)

    let { name, username, phonenumber, email, password } = formState.inputs


    const onChange = () => {
        console.log("Captcha value:verify shod");
        setIsRecapchaVerified(true)
    }
    return (
        <>
            <div className='register-container'>
                <div className="register">
                    <span className="register-subtitle">
                        Welcome to ACADEMIA :)
                    </span>

                    <div className="register__new-member">
                        <span className="register__new-member-text">
                            Do you already have an account?
                        </span>
                        <Button to={"/login"} className="login__new-member-link">Login</Button>
                    </div>

                    <form action="#" className="register-form">
                        <div className="register-form__username">
                            <Input
                                isValid={username.isValid}
                                className="register-form__username-input"
                                placeholder="username"
                                type="input"
                                onChangeInput={(e) => changeInputHandeler(e, "username", [
                                    requiredValidator(),
                                    maxValidator(20),
                                    minValidator(8),

                                ])}

                            />
                            <i className="fa fa-user register-form__username-icon"></i>
                        </div>

                        <div className="register-form__username">
                            <Input
                                isValid={name.isValid}
                                className="register-form__username-input"
                                placeholder="name"
                                type="input"
                                onChangeInput={(e) => changeInputHandeler(e, "name", [
                                    requiredValidator(),
                                    maxValidator(20),
                                    minValidator(6),

                                ])}

                            />
                            <i className="fa fa-user register-form__username-icon"></i>
                        </div>

                        <div className="register-form__username">
                            <Input
                                isValid={email.isValid}
                                className="register-form__password-input"
                                placeholder="Email Address"
                                type="input"
                                onChangeInput={(e) => changeInputHandeler(e, "email", [
                                    requiredValidator(),
                                    emailValidator(),
                                    maxValidator(25)
                                ])}

                            />
                            <i className="fa fa-user register-form__username-icon"></i>
                        </div>
                        <div className="register-form__username">
                            <Input
                                isValid={phonenumber.isValid}
                                className="register-form__password-input"
                                placeholder="Phone Number"
                                type="input"
                                onChangeInput={(e) => changeInputHandeler(e, "phonenumber", [
                                    requiredValidator(),
                                    phoneValidator()
                                ])}

                            />
                            <i className="fa fa-user register-form__username-icon"></i>
                        </div>
                        <div className="register-form__password">
                            <Input
                                isValid={password.isValid}
                                className="register-form__password-input"
                                placeholder="Password"
                                type="input"
                                onChangeInput={(e) => changeInputHandeler(e, "password", [
                                    requiredValidator(),
                                    maxValidator(18),
                                    minValidator(8),
                                ])}
                            />
                            <i className="fa fa-lock-open register-form__password-icon"></i>
                        </div>
                        <ReCAPTCHA
                            sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
                            onChange={onChange}
                        />
                        <Button className={`register-form__btn ${formState.isFormValid && isRecapchaVerified ? "active" : null}`}
                            disabled={!formState.isFormValid && !isRecapchaVerified} type="submit" actionForm={(e) => registerNewUser(e)}>
                            <i className="fas fa-sign-out-alt register-form__btn-icon"></i>
                            <span className="register-form__btn-text">Sign Up</span>
                        </Button>

                        <div className="register-form__password-setting">
                            <label className="register-form__password-remember">
                                <input type="checkbox" className="register-form__password-checkbox"></input>
                                <span className="register-form__password-text">Remember me</span>
                            </label>
                        </div>

                    </form>

                    <div className="register-des">
                        <span className="register-des-title"></span>
                        <ul className="register-des-list">
                            <li className="register-des-item">
                                We respect your privacy.Your information is safe With us.
                            </li>
                            <li className="register-des-item">
                                Change your password preodically for better security.
                            </li>
                            <li className="register-des-item">
                                Log out from public or shared device after use.
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </>
    )
}
