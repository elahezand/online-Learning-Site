import { emailValidator, phoneValidator, requiredValidator, minValidator, maxValidator } from '../../../validators/rules'
import Button from '../../modules/Form/Button'
import Input from "../../modules/Form/Input"



export default function ContactMain({ changeInputHandeler, formState, sendComment }) {

    let { name, phone, email, body } = formState.inputs

    return (
        <>
            <div className='container mt-5'>
                <div className='contact'>
                    <div className="row">
                        <div className='col-6 contact-left'>
                            <span className="contact-title"> Contact With US </span>
                            <span className="contact-subtitle">Please send your review </span>
                            <form action="#" className="contact-form">
                                <div className="contact-form__username">
                                    <Input
                                        type="input"
                                        onChangeInput={(e) =>
                                            changeInputHandeler(e, "name",
                                                [requiredValidator(),
                                                minValidator(10),
                                                maxValidator(20)])}
                                        placeholder="Username"
                                        className="contact-form__username-input"
                                        isValid={name.isValid}
                                    />
                                    <i className="fa fa-user contact-form__username-icon"></i>
                                </div>
                                <div className="contact-form__password">
                                    <Input
                                        type="input"
                                        onChangeInput={(e) =>
                                            changeInputHandeler(e, "email", [
                                                emailValidator()
                                            ])}
                                        placeholder="Email"
                                        className="contact-form__password-input"
                                        isValid={email.isValid}
                                    />
                                    <i className="fa fa-envelope contact-form__password-icon"></i>
                                </div>
                                <div className="contact-form__password">
                                    <Input
                                        type="input"
                                        onChangeInput={(e) =>
                                            changeInputHandeler(e, "phone", [
                                                phoneValidator(),
                                            ])}
                                        placeholder="Phone number"
                                        className="contact-form__password-input"
                                        isValid={phone.isValid}
                                    />
                                    <i className="fa fa-phone contact-form__password-icon"></i>
                                </div>

                                <div className="contact-form__password">
                                    <Input
                                        type="texterea"
                                        className="texterea"
                                        placeholder="please send your comment"
                                        onChangeInput={(e) =>
                                            changeInputHandeler(e, "body", [
                                                requiredValidator(),
                                                minValidator(10),
                                                maxValidator(100)
                                            ])}
                                        isValid={body.isValid}

                                    />
                                </div>

                                <Button className={`register-form__btn ${formState.isFormValid ? "active" : null}`}
                                    disabled={!formState.isFormValid} type="submit" actionForm={(e) => sendComment(e)}>
                                    <span className="register-form__btn-text">Send</span>
                                </Button>
                            </form>
                        </div>
                        <div className='col-6'>
                            <img className='contact-img' src="/images/blog/image_3.jpg.webp" alt="" />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
