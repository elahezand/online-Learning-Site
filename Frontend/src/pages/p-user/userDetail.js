import { useEffect, useState } from 'react'
import { useContext } from 'react'
import authContext from '../../context/authContext.js'
import swal from 'sweetalert'
import getMe from '../../utils/auth.js'

export default function UserDetail() {
  const AuthContext = useContext(authContext)

  const [phone, setPhone] = useState("")
  const [name, setName] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [email, setEmail] = useState("")

  useEffect(() => {
    setPassword(AuthContext.userInfo?.password || "")
    setEmail(AuthContext.userInfo?.email || "")
    setPhone(AuthContext.userInfo?.phone || "")
    setName(AuthContext.userInfo?.name || "")
    setUsername(AuthContext.userInfo?.username || "")
  }, [AuthContext.userInfo])

  const EditDetail = async (e) => {
    e.preventDefault()
    const token = await getMe()
    if (token) {
      swal({
        title: "Are you sure to save Changes?",
        icon: "warning",
        buttons: ["No", "yes"]
      }).then(async result => {
        if (result) {
          const res = await fetch("http://localhost:4000/v1/users", {
            method: "PUT",
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-type": "application/json"
            },
            body: JSON.stringify({
              username,
              name,
              email,
              password,
              phone
            })
          })
            if (res.ok) {
              swal({
                title: "your Account was updated successfully",
                icon: "success",
                buttons: "ok"
              })
            }          
        }
      })
    }
  }

  return (
    <>
      <h1 className="h4 mb-4">Account details</h1>
      <form className="d-flex flex-column gap-4" onSubmit={(e) => EditDetail(e)}>
        <fieldset className="row g-3">
          <div className="col-12 col-md-6">
            <label className="form-label" htmlFor="detail-name">Name *</label>
            <input id="detail-name" className="form-control" type="text" value={name}
              onChange={event => setName(event.target.value)} placeholder="Please send your Name" />
          </div>
          <div className="col-12 col-md-6">
            <label className="form-label" htmlFor="detail-username">Username *</label>
            <input id="detail-username" className="form-control" type="text" value={username}
              onChange={event => setUsername(event.target.value)} placeholder="Please send your Username" />
          </div>
          <div className="col-12 col-md-6">
            <label className="form-label" htmlFor="detail-email">Email *</label>
            <input id="detail-email" className="form-control" type="email" value={email}
              onChange={event => setEmail(event.target.value)} placeholder="Plaese send your Email" />
          </div>
          <div className="col-12 col-md-6">
            <label className="form-label" htmlFor="detail-phone">Phone Number *</label>
            <input id="detail-phone" className="form-control" type="tel" value={phone}
              onChange={event => setPhone(event.target.value)} placeholder="Please send your Phone Number" />
          </div>
        </fieldset>

        <fieldset className="row g-3">
          <legend className="h6 fw-bold text-primary-strong border-bottom pb-2 mb-1">change your password</legend>
          <div className="col-12 col-md-4">
            <label className="form-label" htmlFor="detail-old-pass">Previous Password</label>
            <input id="detail-old-pass" className="form-control" type="password" />
          </div>
          <div className="col-12 col-md-4">
            <label className="form-label" htmlFor="detail-new-pass">New Password</label>
            <input id="detail-new-pass" className="form-control" type="password"
              value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <div className="col-12 col-md-4">
            <label className="form-label" htmlFor="detail-repeat-pass">Repeat New Password</label>
            <input id="detail-repeat-pass" className="form-control" type="password" />
          </div>
        </fieldset>

        <div>
          <button className="btn btn-primary px-4" type='submit'>
            Save Changes
          </button>
        </div>
      </form>
    </>
  )
}
