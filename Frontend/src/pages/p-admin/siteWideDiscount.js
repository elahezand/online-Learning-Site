import { useState } from 'react'
import Button from '../../components/modules/Form/Button'
import swal from 'sweetalert'
import getMe from '../../utils/auth'
import { useNavigate } from 'react-router-dom'

export default function SiteWideDiscount() {
    const [discount, setDiscount] = useState("")
    const navigate = useNavigate()
   
    const addNewDiscount = async () => {
        const token = await getMe()
        const res = await fetch(`http://localhost:4000/v1/offs/all`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                discount: discount,
            })
        })
        if (res.ok) {
            swal({
                title: "the Discount was created successfully",
                icon: "success",
                buttons: "ok"
            }).then(result => {
                if (result) {
                    navigate("/p-admin/discounts")
                }
            })
        }
    }

    return (
        <>
            <div className="form-container">
                <div className='form-header'>
                    <i className="fa-solid fa-plus"></i>
                    <h1>Running New Campaign</h1>
                </div>
                <form className="form">
                    <div className='row'>
                        <div className="col-6">
                            <div className="register-form__username">
                                <input
                                    className="register-form__username-input"
                                    placeholder="Please send sitewide Discount"
                                    type="input"
                                    onChange={(e) => setDiscount(e.target.value)}
                                />
                                <i className="fa fa-user register-form__username-icon"></i>
                            </div>
                        </div>
                    </div>
                </form>
                <Button
                    className='form__btn active'
                    actionForm={(e) => addNewDiscount(e)}>
                    <span className="form__btn-text">Create</span>
                    <i className="fa fa-plus form__btn-icon"></i>
                </Button>
            </div>

        </>
    )
}
