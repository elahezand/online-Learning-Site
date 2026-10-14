import { useRoutes } from 'react-router-dom';
import routes from './routes';
import authContext from './context/authContext.js';
import getMe from './utils/auth.js';
import { useEffect, useState } from 'react';



function App() {
  let mainRoutes = useRoutes(routes)
  const [userInfo, setUserInfo] = useState({})
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [token, setToken] = useState("")

  const login = async (token, user) => {
    localStorage.setItem("userData", JSON.stringify({ token }))
    setIsLoggedIn(true)
    setUserInfo(user)
    setToken(token)
  }

  const logout = async () => {
    localStorage.removeItem("userData")
    setUserInfo({})
  }


  const getInfo = async () => {
    const token = await getMe()
    if (token) {
      setToken(token)
      const res = await fetch(`http://localhost:4000/v1/auth/me`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      })
      if (res.status === 200) {
        const data = await res.json()
        setUserInfo(data)
        setIsLoggedIn(true)
      }
    }
  }


  useEffect(() => {
    getInfo()
  }, [token])


  return (
    <>

      <authContext.Provider
        value={
          {
            token,
            userInfo,
            isLoggedIn,
            logout,
            login
          }}>

        {mainRoutes}
      </authContext.Provider>
    </>
  );
}

export default App;
