import { useReducer } from 'react'
import "./NewsLetter.css"
import regex from '../../../validators/regex';
import Button from "../../modules/Form/Button"
import swal from 'sweetalert';


const inputreducer = (state, action) => {
    switch (action.type) {
        case "CHANGE": {
            return {
                ...state,
                value: action.value,
                isvalid: action.isvalid
            }
        }
        default: {
            return state
        }
    }
}

export default function NewsLetter() {
    const [emailUser, dispatch] = useReducer(inputreducer, {
        value: "",
        isvalid: false
    })


    const emailuserHandeler = (e) => {
        dispatch({
            type: "CHANGE",
            value: e.target.value,
            isvalid: regex.testEmail(e.target.value) ? true : false
        })
    }

    const sendRequest = async (e) => {
        e.preventDefault()
        const res = await fetch(`http://localhost:4000/v1/newsletters`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(
                { email: emailUser.value }
            )
        })
        if (res.ok) {
            swal({
                title: "You have subscribed to the newsletter :)",
                icon: "success",
                buttons: "ok"
            })
        }
    }

    return (
        <section className='newsletter mt-5'>
            <div className="container py-5">
                <div className="row align-items-center g-4">
                    <div className='col-12 col-lg-6'>
                        <h2 className="newsletter__title">Newsletter - Stay tune and get the latest update</h2>
                        <p className="newsletter__text mb-0">Far far away, behind the word mountains</p>
                    </div>
                    <div className="col-12 col-lg-6">
                        <form action="#" className='newsletter__form ms-lg-auto' onSubmit={(e) => sendRequest(e)}>
                            <input type="email" placeholder='Enter email address' aria-label="Email address"
                                onChange={(e) => emailuserHandeler(e)} />
                            <Button
                                type="submit"
                                className="newsletter__btn"
                                ariaLabel="Subscribe"
                                disabled={!emailUser.isvalid}>
                                <i className="fa fa-paper-plane" />
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    )
}
