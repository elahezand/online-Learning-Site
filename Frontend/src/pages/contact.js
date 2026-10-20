import React, { Suspense } from 'react'
import "../styles/auth.css"
import "../styles/contact.css"
import { useNavigate } from 'react-router-dom'
import Topbar from '../components/modules/Topbar/Topbar';
import Footer from '../components/modules/Footer/Footer';
import NewsLetter from '../components/modules/NewsLetter/NewsLetter';
import ContactMain from "../components/templates/contact/ContactMain"
import swal from 'sweetalert'
import { attempt, contactsApi } from '../api';
import useForm from '../Hooks/useForm'

const Landing = React.lazy(() =>
    import('../components/modules/Landing/Landing'))

export default function Contact() {
    const navigator = useNavigate()
    const [formState, changeInputHandeler] = useForm(
        {
            name:
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
            body:
            {
                value: "",
                isValid: false
            },
        },
        false
    )


    let { name, phone, email, body } = formState.inputs

    const sendComment = async (e) => {
        e.preventDefault()
        const res = await attempt(contactsApi.send({ name: name.value, email: email.value, phone: phone.value, body: body.value }))

        if (res.ok) {
            swal({
                title: "Your comment was sended!",
                icon: "success",
                buttons: "ok"
            }).then(result => {
                if (result) {
                    navigator("/")
                }
            })

        }
    }
    return (
        <>

            <Topbar />
            <Suspense fallback={<div className="landing-fallback">Loading…</div>}>
                <Landing url="/images/blog/hero_1.jpg.webp" />
            </Suspense>
            <ContactMain
                sendComment={sendComment}
                formState={formState}
                changeInputHandeler={changeInputHandeler} />
            <NewsLetter />
            <Footer />

        </>
    )
}
