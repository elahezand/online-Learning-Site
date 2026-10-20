import React, { Suspense } from 'react'
import "../styles/auth.css"
import Topbar from '../components/modules/Topbar/Topbar.js';
import swal from 'sweetalert';
import { useAuth } from '../context/AuthContext'
import { authApi } from '../api';
import { notifyError } from '../utils/notify';
import useForm from '../Hooks/useForm.js';
import Footer from '../components/modules/Footer/Footer.js';
import RegisterMain from '../components/templates/rejester/RegisterMain.js'
const Landing = React.lazy(() =>
    import('../components/modules/Landing/Landing'))

export default function Register() {
    const Authcontext = useAuth()
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
            phonenumber:
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


    let { name, username, phonenumber, email, password } = formState.inputs

    const registerNewUser = async (e) => {
        e.preventDefault()
        try {
            const result = await authApi.register({
                name: name.value,
                username: username.value,
                email: email.value,
                phone: phonenumber.value,
                password: password.value,
                confirmPassword: password.value
            })
            if (result?.accessToken) {
                Authcontext.login(result.accessToken)
                swal({ title: "welcome to ACADEMIA!", icon: "success", buttons: "ok" })
            } else {
                swal({ title: "your phonenumber has been banned", icon: "warning", buttons: "ok" })
            }
        } catch (err) {
            notifyError(err, "Username and name are dublicated")
        }
    }
    return (
        <>
            <Topbar />
            <Suspense fallback={<div className="landing-fallback">Loading…</div>}>
                <Landing url="/images/blog/hero_1.jpg.webp" />
            </Suspense>
            <RegisterMain
                formState={formState}
                changeInputHandeler={changeInputHandeler}
                registerNewUser={registerNewUser} />
            <Footer />
        </>
    )
}
