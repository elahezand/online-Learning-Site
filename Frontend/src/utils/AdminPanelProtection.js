import { useEffect } from 'react'
import { useContext } from 'react'
import authContext from '../context/authContext.js'
import { useNavigate } from 'react-router-dom'

export default function AdminPanelProtection({ children }) {
    const AuthContext = useContext(authContext)
    const navigate = useNavigate()
    useEffect(() => {
        if (AuthContext.userInfo.role === "USER") {
            navigate("/")
        }
    }, [AuthContext.userInfo.role, navigate])
    return (
        <>

            {AuthContext.userInfo.role === "ADMIN" ?
                <>
                    {children}
                </> : null
            }

        </>
    )
}
