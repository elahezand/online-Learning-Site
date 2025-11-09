import React, { Suspense } from 'react'
import "../styles/contact.css"
import { useNavigate } from 'react-router-dom'
import Topbar from '../components/modules/Topbar/Topbar';
import Footer from '../components/modules/Footer/Footer';
import NewsLetter from '../components/modules/NewsLetter/NewsLetter';
import ContactMain from "../components/templates/contact/ContactMain"
import swal from 'sweetalert';
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
        const res = await fetch(`http://localhost:4000/v1/contact`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"

            },
            body: JSON.stringify({
                name: name.value,
                email: email.value,
                phone: phone.value,
                body: body.value
            })
        })

        if (res.status === 200) {
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
            <Suspense fallback={<span>loading....</span>}>
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
