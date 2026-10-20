import { useState } from 'react'
import Button from '../../components/modules/Form/Button'
import swal from 'sweetalert'
import { attempt, discountsApi } from '../../api'
import { useNavigate } from 'react-router-dom'

export default function SiteWideDiscount() {
    const [discount, setDiscount] = useState("")
    const navigate = useNavigate()
   
    const addNewDiscount = async () => {
        const res = await attempt(discountsApi.setSiteWide(discount))
        if (res.ok) {
            swal({
                title: "the Discount was created successfully",
                icon: "success",
                buttons: "ok"
            }).then(result => {
                if (result) {
                    navigate("/p-admin/discounts/1")
                }
            })
        }
    }

    return (
        <>
            <section className="card admin-form">
                <div className="admin-form__header">
                    <span className="icon-badge"><i className="fa-solid fa-plus"></i></span>
                    <h2 className="h5 fw-bold mb-0">Running New Campaign</h2>
                </div>
                <form className="admin-form__body" onSubmit={(e) => e.preventDefault()}>
                    <div className='row g-3'>
                        <div className="col-12 col-md-6">
                            <div className="input-icon">
                                <input
                                                                        className="form-control"
                                                                        placeholder="Please send sitewide Discount"
                                                                        aria-label="Sitewide discount"
                                    type="input"
                                    onChange={(e) => setDiscount(e.target.value)}
                                />
                                <i className="fa fa-user input-icon__icon"></i>
                            </div>
                        </div>
                    </div>
                </form>
                <Button
                    className="btn btn-primary d-inline-flex align-items-center gap-2"
                    actionForm={(e) => addNewDiscount(e)}>
                    <span>Create</span>
                    <i className="fa fa-plus"></i>
                </Button>
            </section>

        </>
    )
}
