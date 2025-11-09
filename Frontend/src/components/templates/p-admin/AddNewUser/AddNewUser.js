import Input from '../../../modules/Form/Input'
import Button from '../../../modules/Form/Button'
import "./AddNewUser.css"
import { requiredValidator, emailValidator, maxValidator, phoneValidator, minValidator } from '../../../../validators/rules'
import useForm from '../../../../Hooks/useForm'
import swal from 'sweetalert'

export default function AddNewUser({ getAllUsers }) {
    const [formState, changeInputHandeler] = useForm(
        {
            name:
            {
                value: "",
                isValid: false
            },
            username:
            {
                value: "",
                isValid: false
            },
            phone:
            {
                value: "",
                isValid: false
            },
            email:
            {
                value: "",
                isValid: false
            },
            password:
            {
                value: "",
                isValid: false
            }
        },
        false)

    let { name, username, phone, email, password } = formState.inputs

    const registerNewUser = async (e) => {
        e.preventDefault()
        const res = await fetch(`http://localhost:4000/v1/auth/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: name.value,
                username: username.value,
                email: email.value,
                phone: phone.value,
                password: password.value,
                confirmPassword: password.value

            })

        })
        if (res.ok) {
            const data = await res.json()
            if (data.accessToken) {
                swal({
                    title: "this User was added successfuly",
                    icon: "success",
                    buttons: "ok"
                })
            } else {
                swal({
                    title: "your phonenumber has been banned",
                    icon: "warning",
                    buttons: "ok"
                })
            }
        }
        else {
            swal({
                title: "Username and name are dublicated",
                icon: "error",
                buttons: "ok"
            })
        }
    }


    return (
        <>

            <div className="form-container">
                <div className='form-header'>
                    <i className="fa-solid fa-user-plus"></i>
                    <h1>Add New User</h1>
                </div>
                <form className="form">
                    <div className='row'>
                        <div className="col-6">
                            <div className="register-form__username">
                                <Input
                                    isValid={name.isValid}
                                    className="register-form__username-input"
                                    placeholder="name"
                                    type="input"
                                    onChangeInput={(e) =>
                                        changeInputHandeler(e, "name", [
                                            requiredValidator(),
                                            maxValidator(20),
                                            minValidator(6),

                                        ])} />
                                <i className="fa fa-user register-form__username-icon"></i>
                            </div>
                        </div>
                        <div className="col-6">
                            <div className="register-form__username">
                                <Input
                                    isValid={username.isValid}
                                    className="register-form__username-input"
                                    placeholder="username"
                                    type="input"
                                    onChangeInput={(e) =>
                                        changeInputHandeler(e, "username", [
                                            requiredValidator(),
                                            maxValidator(20),
                                            minValidator(6),

                                        ])} />
                                <i className="fa fa-user register-form__username-icon"></i>
                            </div>
                        </div>

                        <div className="col-6">
                            <div className="register-form__username">
                                <Input
                                    isValid={email.isValid}
                                    className="register-form__username-input"
                                    placeholder="Email"
                                    type="input"
                                    onChangeInput={(e) =>
                                        changeInputHandeler(e, "email", [
                                            emailValidator()
                                        ])} />
                                <i className="fa fa-user register-form__username-icon"></i>
                            </div>
                        </div>


                        <div className="col-6">
                            <div className="register-form__username">
                                <Input
                                    isValid={phone.isValid}
                                    className="register-form__username-input"
                                    placeholder="Phone"
                                    type="input"
                                    onChangeInput={(e) =>
                                        changeInputHandeler(e, "phone", [
                                            phoneValidator()

                                        ])} />
                                <i className="fa fa-user register-form__username-icon"></i>
                            </div>
                        </div>

                        <div className="col-6">
                            <div className="register-form__username">
                                <Input
                                    isValid={password.isValid}
                                    className="register-form__username-input"
                                    placeholder="Password"
                                    type="input"
                                    onChangeInput={(e) =>
                                        changeInputHandeler(e, "password", [
                                            requiredValidator(),
                                            maxValidator(20),
                                            minValidator(6),

                                        ])} />
                                <i className="fa fa-user register-form__username-icon"></i>
                            </div>
                        </div>
                    </div>
                </form>
                <Button
                    className={`form__btn ${formState.isFormValid ? "active" : null}`}
                    disabled={!formState.isFormValid} type="submit"
                    actionForm={(e) => registerNewUser(e)}>
                    <span className="form__btn-text">Submit</span>
                    <i className="fa fa-plus form__btn-icon"></i>
                </Button>

            </div>


        </>
    )
}


