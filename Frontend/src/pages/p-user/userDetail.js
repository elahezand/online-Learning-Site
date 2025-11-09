import { useEffect, useState } from 'react'
import { useContext } from 'react'
import authContext from '../../context/authContext.js'
import "../../styles/p-user/user-detail.css"
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
      <div className="edit">
        <form className="edit__form">
          <div className="edit__personal">
            <div className="row">
              <div className="col-12">
                <label className="edit__label"> Name *</label>
                <input
                  className="edit__input"
                  type="text"
                  value={name}
                  onChange={event => setName(event.target.value)}
                  placeholder=" Please send your Name  "
                />
              </div>
              <div className="col-12">
                <label className="edit__label">Username *</label>
                <input
                  className="edit__input"
                  type="text"
                  value={username}
                  onChange={event => setUsername(event.target.value)}
                  placeholder=" Please send your Username"
                />

              </div>
              <div className="col-12">
                <label className="edit__label"> Email *</label>
                <input
                  className="edit__input"
                  type="text"
                  value={email}
                  onChange={event => setEmail(event.target.value)}
                  placeholder="Plaese send your Email"
                />
              </div>
              <div className="col-12">
                <label className="edit__label"> Phone Number *</label>
                <input
                  className="edit__input"
                  type="text"
                  value={phone}
                  onChange={event => setPhone(event.target.value)}
                  placeholder=" Please send your Phone Number  "
                />
              </div>

            </div>
          </div>
          <div className="edit__password">
            <span className="edit__password-title">change your password</span>
            <div className="row">
              <div className="col-12">
                <label className="edit__label">
                  Previous Password
                </label>
                <input
                  className="edit__input"
                  type="text"
                  placeholder=" "
                />
              </div>
              <div className="col-12">
                <label className="edit__label">
                  New Password
                </label>
                <input
                  className="edit__input"
                  type="text"
                  placeholder=""
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="col-12">
                <label className="edit__label"> Repeat New Password</label>
                <input
                  className="edit__input"
                  type="text"
                  placeholder=""
                />
              </div>
            </div>
          </div>
          <button className="edit__btn" type='submit'
            onClick={(e) => EditDetail(e)} >
            Save Changes
          </button>
        </form>
      </div>
    </>
  )
}
