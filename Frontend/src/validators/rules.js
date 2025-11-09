const requiredValue = "REQUIRED_VALUE"
const minValue = "MIN_VALUE"
const maxValue = "MAX_VALUE"
const emailValue = "EMAIL_VALUE"
const phoneValue = "PHONE_VALUE"

export const requiredValidator = () => {
    return { value: requiredValue }
}

export const minValidator = (min) => {
    return {
        value: minValue,
        min
    }
}

export const maxValidator = (max) => {
    return {
        value: maxValue,
        max

    }
}

export const emailValidator = () => {
    return {
        value: emailValue,
    }
}

export const phoneValidator = () => {
    return {
        value: phoneValue,
    }
}


export default {
    requiredValue,
    minValue,
    maxValue,
    emailValue,
    phoneValue
}