import React, { Suspense } from 'react'
import "../styles/register.css"
import Topbar from '../components/modules/Topbar/Topbar.js';
import swal from 'sweetalert';
import { useContext } from 'react';
import authContext from '../context/authContext.js';
import { useNavigate } from 'react-router-dom';
import useForm from '../Hooks/useForm.js';
import Footer from '../components/modules/Footer/Footer.js';
import RegisterMain from '../components/templates/rejester/RegisterMain.js'
const Landing = React.lazy(() =>
    import('../components/modules/Landing/Landing'))

export default function Register() {
    const Authcontext = useContext(authContext)
    const navigate = useNavigate()
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

    const registerNewUser = (e) => {
        e.preventDefault()
        fetch(`http://localhost:4000/v1/auth/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: name.value,
                username: username.value,
                email: email.value,
                phone: phonenumber.value,
                password: password.value,
                confirmPassword: password.value

            })

        }).then(res => res.json())
            .then(result => {
                if (result.accessToken) {
                    swal({
                        title: "welcome to ACADEMIA!",
                        icon: "success",
                        buttons: "ok"
                    }).then(result => {
                        navigate("/")
                    })
                    Authcontext.login(result.accessToken, result.user)
                } else {
                    swal({
                        title: "your phonenumber has been banned",
                        icon: "warning",
                        buttons: "ok"
                    })
                }
            }).catch(err => {
                swal({
                    title: "Username and name are dublicated",
                    icon: "error",
                    buttons: "ok"
                })
            })

    }
    return (
        <>
            <Topbar />
            <Suspense fallback={<div style={{ height: "700px" }}>loading....</div>}>
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
