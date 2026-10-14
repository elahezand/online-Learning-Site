import { useState } from 'react'
import {
    emailValidator, requiredValidator,
    phoneValidator, maxValidator, minValidator
} from '../../../validators/rules.js';
import Input from '../../modules/Form/Input.js';
import Button from '../../modules/Form/Button.js';
import ReCAPTCHA from "react-google-recaptcha";
import useTheme from '../../../Hooks/useTheme.js';


export default function RegisterMain({ formState, changeInputHandeler, registerNewUser }) {

    const [isRecapchaVerified, setIsRecapchaVerified] = useState(false)
    const [theme] = useTheme()

    let { name, username, phonenumber, email, password } = formState.inputs
    const canSubmit = formState.isFormValid && isRecapchaVerified

    const onChange = () => {
        setIsRecapchaVerified(true)
    }

    const fields = [
        { key: "username", state: username, placeholder: "username", icon: "fa fa-user", rules: [requiredValidator(), maxValidator(20), minValidator(8)] },
        { key: "name", state: name, placeholder: "name", icon: "fa fa-id-card", rules: [requiredValidator(), maxValidator(20), minValidator(6)] },
        { key: "email", state: email, placeholder: "Email Address", icon: "fa fa-envelope", inputType: "email", rules: [requiredValidator(), emailValidator(), maxValidator(25)] },
        { key: "phonenumber", state: phonenumber, placeholder: "Phone Number", icon: "fa fa-phone", inputType: "tel", rules: [requiredValidator(), phoneValidator()] },
        { key: "password", state: password, placeholder: "Password", icon: "fa fa-lock", inputType: "password", rules: [requiredValidator(), maxValidator(18), minValidator(8)] },
    ]

    return (
        <section className='auth-section'>
            <div className="container">
                <div className="card auth-card mx-auto">
                    <div className="card-body p-4 p-sm-5">
                        <div className="text-center mb-4">
                            <h1 className="h4 mb-1">Create your account</h1>
                            <p className="text-body-secondary mb-0">Welcome to ACADEMIA :)</p>
                        </div>

                        <div className="auth-switch mb-4">
                            <span>Do you already have an account?</span>
                            <Button to={"/login"} className="btn btn-sm btn-primary">Login</Button>
                        </div>

                        <form action="#" className="d-flex flex-column gap-3" onSubmit={(e) => e.preventDefault()}>
                            {fields.map(field => (
                                <div className="input-icon" key={field.key}>
                                    <Input
                                        isValid={field.state.isValid}
                                        placeholder={field.placeholder}
                                        type="input"
                                        inputType={field.inputType}
                                        onChangeInput={(e) => changeInputHandeler(e, field.key, field.rules)}
                                    />
                                    <i className={`${field.icon} input-icon__icon`}></i>
                                </div>
                            ))}

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
                                className={`btn btn-lg w-100 d-flex align-items-center justify-content-center gap-2 ${canSubmit ? "btn-primary" : "btn-secondary"}`}
                                disabled={!formState.isFormValid && !isRecapchaVerified}
                                actionForm={(e) => registerNewUser(e)}>
                                <i className="fas fa-user-plus"></i>
                                <span>Sign Up</span>
                            </Button>

                            <div className="form-check small mb-0">
                                <input type="checkbox" className="form-check-input" id="remember-register" />
                                <label className="form-check-label text-body-secondary" htmlFor="remember-register">Remember me</label>
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
