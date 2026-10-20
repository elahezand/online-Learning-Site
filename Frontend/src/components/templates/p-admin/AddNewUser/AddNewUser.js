import Input from '../../../modules/Form/Input'
import Button from '../../../modules/Form/Button'
import { requiredValidator, emailValidator, maxValidator, phoneValidator, minValidator } from '../../../../validators/rules'
import useForm from '../../../../Hooks/useForm'
import swal from 'sweetalert'
import { useQueryClient } from '@tanstack/react-query'
import { authApi, queryKeys } from '../../../../api'
import { notifyError } from '../../../../utils/notify'

export default function AddNewUser() {
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

    const queryClient = useQueryClient()

    const registerNewUser = async (e) => {
        e.preventDefault()
        try {
            const data = await authApi.register({
                name: name.value,
                username: username.value,
                email: email.value,
                phone: phone.value,
                password: password.value,
                confirmPassword: password.value
            })
            if (data?.accessToken) {
                swal({ title: "this User was added successfuly", icon: "success", buttons: "ok" })
                queryClient.invalidateQueries({ queryKey: queryKeys.users })
            } else {
                swal({ title: "your phonenumber has been banned", icon: "warning", buttons: "ok" })
            }
        } catch (err) {
            notifyError(err, "Username and name are dublicated")
        }
    }


    return (
        <>

            <section className="card admin-form">
                <div className="admin-form__header">
                    <span className="icon-badge"><i className="fa-solid fa-user-plus"></i></span>
                    <h2 className="h5 fw-bold mb-0">Add New User</h2>
                </div>
                <form className="admin-form__body" onSubmit={(e) => e.preventDefault()}>
                    <div className='row g-3'>
                        <div className="col-12 col-md-6">
                            <div className="input-icon">
                                <Input
                                    isValid={name.isValid}
                                    placeholder="name"
                                    type="input"
                                    onChangeInput={(e) =>
                                        changeInputHandeler(e, "name", [
                                            requiredValidator(),
                                            maxValidator(20),
                                            minValidator(6),

                                        ])} />
                                <i className="fa fa-user input-icon__icon"></i>
                            </div>
                        </div>
                        <div className="col-12 col-md-6">
                            <div className="input-icon">
                                <Input
                                    isValid={username.isValid}
                                    placeholder="username"
                                    type="input"
                                    onChangeInput={(e) =>
                                        changeInputHandeler(e, "username", [
                                            requiredValidator(),
                                            maxValidator(20),
                                            minValidator(6),

                                        ])} />
                                <i className="fa fa-user input-icon__icon"></i>
                            </div>
                        </div>

                        <div className="col-12 col-md-6">
                            <div className="input-icon">
                                <Input
                                    isValid={email.isValid}
                                    placeholder="Email"
                                    type="input"
                                    onChangeInput={(e) =>
                                        changeInputHandeler(e, "email", [
                                            emailValidator()
                                        ])} />
                                <i className="fa fa-user input-icon__icon"></i>
                            </div>
                        </div>


                        <div className="col-12 col-md-6">
                            <div className="input-icon">
                                <Input
                                    isValid={phone.isValid}
                                    placeholder="Phone"
                                    type="input"
                                    onChangeInput={(e) =>
                                        changeInputHandeler(e, "phone", [
                                            phoneValidator()

                                        ])} />
                                <i className="fa fa-user input-icon__icon"></i>
                            </div>
                        </div>

                        <div className="col-12 col-md-6">
                            <div className="input-icon">
                                <Input
                                    isValid={password.isValid}
                                    placeholder="Password"
                                    type="input"
                                    onChangeInput={(e) =>
                                        changeInputHandeler(e, "password", [
                                            requiredValidator(),
                                            maxValidator(20),
                                            minValidator(6),

                                        ])} />
                                <i className="fa fa-user input-icon__icon"></i>
                            </div>
                        </div>
                    </div>
                </form>
                <Button
                    className={`btn ${formState.isFormValid ? "btn-primary" : "btn-secondary"} d-inline-flex align-items-center gap-2`}
                    disabled={!formState.isFormValid} type="submit"
                    actionForm={(e) => registerNewUser(e)}>
                    <span>Submit</span>
                    <i className="fa fa-plus"></i>
                </Button>

            </section>


        </>
    )
}


