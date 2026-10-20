import React, { Suspense } from 'react'
import "../styles/auth.css"
import { useAuth } from '../context/AuthContext'
import { authApi } from '../api'
import { notifyError } from '../utils/notify'
import useForm from '../Hooks/useForm.js'
import Topbar from "../components/modules/Topbar/Topbar.js"
import Footer from '../components/modules/Footer/Footer.js'
import LoginMain from '../components/templates/login/LoginMain.js'
import swal from 'sweetalert';

const Landing = React.lazy(() =>
    import('../components/modules/Landing/Landing'))

export default function Login() {

    const AuthContext = useAuth()



    const [formState, changeInputHandeler] = useForm({
        username:
        {
            value: "",
            isValid: false
        },
        password:
        {
            value: "",
            isValid: false
        },

    }, false)


    const { username, password } = formState.inputs



    const loginUser = async (e) => {
        e.preventDefault()
        try {
            const data = await authApi.login(username.value, password.value)
            AuthContext.login(data.accessToken)
            swal({ title: "Welcome to ACADEMIA", icon: "success", buttons: "ok" })
        } catch (err) {
            notifyError(err, "Please try again")
        }
    }
    return (
        <>
            <Topbar />
            <Suspense fallback={<div className="landing-fallback">Loading…</div>}>
                <Landing url="/images/blog/hero_1.jpg.webp" />
            </Suspense>
            <LoginMain
                formState={formState}
                changeInputHandeler={changeInputHandeler}
                loginUser={loginUser} />
            <Footer />
        </>
    )
}
