const testEmail = (value) => {
    const emailPattern = /^[a-z0-9]+@[a-z]+\.[a-z]{2,3}$/g

    return emailPattern.test(value)
}

const testPhonenumber = (value) => {
    const phonePattern = /^0(9[0-9]{9})$/

    return phonePattern.test(value)
}


const regex = {
    testEmail,
    testPhonenumber
}

export default regex