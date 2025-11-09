import { useReducer } from 'react'
import "./NewsLetter.css"
import regex from '../../../validators/regex';
import Button from "../../modules/Form/Button"
import swal from 'sweetalert';


const inputreducer = (state, action) => {
    switch (action.type) {
        default: {
            return state
        }
        case "CHANGE": {
            return {
                ...state,
                value: action.value,
                isvalid: action.isvalid
            }

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
            }).then(result => {

            })

        }
    }
    return (
        <>
            <div className='newsletter-container'>
                <div className='newsletter-right'>
                    <p>Newsletter - Stay tune and get the latest update
                    </p>
                    <span>Far far away, behind the word mountains
                    </span>
                </div>
                <form action="#" className='newsletter-left'>
                    <input type="text" placeholder='Enter email adrress'
                        onChange={(e) => emailuserHandeler(e)} />

                    <Button
                        disabled={!emailUser.isvalid}
                        actionForm={(e) => sendRequest(e)}>
                        <i className="fa fa-paper-plane" />
                    </Button>
                </form>
            </div>

        </>
    )
}
