
const getMe = async () => {
    const getFromLocalSorage = JSON.parse(localStorage.getItem("userData"))
    if (getFromLocalSorage) {
        return getFromLocalSorage.token
    }
    else {
        return null
    }
}

export default getMe