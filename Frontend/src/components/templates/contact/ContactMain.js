import { emailValidator, phoneValidator, requiredValidator, minValidator, maxValidator } from '../../../validators/rules'
import Button from '../../modules/Form/Button'
import Input from "../../modules/Form/Input"


export default function ContactMain({ changeInputHandeler, formState, sendComment }) {

    let { name, phone, email, body } = formState.inputs

    return (
        <section className='auth-section'>
            <div className='container'>
                <div className='card contact-card mx-auto'>
                    <div className="row g-0">
                        <div className='col-12 col-md-7'>
                            <div className="card-body p-4 p-sm-5">
                                <h1 className="h4 mb-1">Contact With US</h1>
                                <p className="text-body-secondary mb-4">Please send your review</p>
                                <form action="#" className="d-flex flex-column gap-3" onSubmit={(e) => e.preventDefault()}>
                                    <div className="input-icon">
                                        <Input
                                            type="input"
                                            onChangeInput={(e) =>
                                                changeInputHandeler(e, "name",
                                                    [requiredValidator(),
                                                    minValidator(10),
                                                    maxValidator(20)])}
                                            placeholder="Username"
                                            isValid={name.isValid}
                                        />
                                        <i className="fa fa-user input-icon__icon"></i>
                                    </div>
                                    <div className="input-icon">
                                        <Input
                                            type="input"
                                            inputType="email"
                                            onChangeInput={(e) =>
                                                changeInputHandeler(e, "email", [
                                                    emailValidator()
                                                ])}
                                            placeholder="Email"
                                            isValid={email.isValid}
                                        />
                                        <i className="fa fa-envelope input-icon__icon"></i>
                                    </div>
                                    <div className="input-icon">
                                        <Input
                                            type="input"
                                            inputType="tel"
                                            onChangeInput={(e) =>
                                                changeInputHandeler(e, "phone", [
                                                    phoneValidator(),
                                                ])}
                                            placeholder="Phone number"
                                            isValid={phone.isValid}
                                        />
                                        <i className="fa fa-phone input-icon__icon"></i>
                                    </div>

                                    <Input
                                        type="texterea"
                                        rows={6}
                                        placeholder="please send your comment"
                                        onChangeInput={(e) =>
                                            changeInputHandeler(e, "body", [
                                                requiredValidator(),
                                                minValidator(10),
                                                maxValidator(100)
                                            ])}
                                        isValid={body.isValid}
                                    />

                                    <Button className={`btn btn-lg w-100 ${formState.isFormValid ? "btn-primary" : "btn-secondary"}`}
                                        disabled={!formState.isFormValid} type="submit" actionForm={(e) => sendComment(e)}>
                                        Send
                                    </Button>
                                </form>
                            </div>
                        </div>
                        <div className='col-md-5 d-none d-md-block'>
                            <img className='contact-card__img' src="/images/blog/image_3.jpg.webp" alt="" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
