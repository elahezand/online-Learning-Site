import React, { Suspense } from 'react'
import "../styles/login.css"
import { useContext } from 'react'
import authContext from '../context/authContext.js'
import { useNavigate } from 'react-router-dom'
import useForm from '../Hooks/useForm.js'
import Topbar from "../components/modules/Topbar/Topbar.js"
import Footer from '../components/modules/Footer/Footer.js'
import LoginMain from '../components/templates/login/LoginMain.js'
import swal from 'sweetalert';

const Landing = React.lazy(() =>
    import('../components/modules/Landing/Landing'))

export default function Login() {

    const AuthContext = useContext(authContext)


    const navigate = useNavigate()

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



    const loginUser = (e) => {
        e.preventDefault()
        fetch(`http://localhost:4000/v1/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                identifier: username.value,
                password: password.value
            })
        }).then(res => {
            if (res.ok) {
                return res.json()
            } else {
                return res.text().then((text) => {
                    throw new Error(text)
                })
            }
        })
            .then(data => {
                swal({
                    title: "Welcome to ACADEMIA",
                    icon: "success",
                    buttons: "ok"
                }).then(data => {
                    navigate("/")

                })
                AuthContext.login(data.accessToken, {})
            })
            .catch((err) => {
                swal({
                    title: "Please try again",
                    icon: "error",
                    buttons: "ok"
                })
            })
    }
    return (
        <>
            <Topbar />
            <Suspense fallback={<span>loading....</span>}>
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
