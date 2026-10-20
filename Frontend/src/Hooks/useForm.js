import { useReducer } from 'react'
import regex from '../validators/regex'
import rules from '../validators/rules'

const formReducer = (state, action) => {
    switch (action.type) {
        default: {
            return state
        }
        case "CHANGE": {
            // Validity must be computed from the inputs *after* this change;
            // using the previous state made the form lag one keystroke behind.
            const inputs = {
                ...state.inputs,
                [action.id]: {
                    value: action.value,
                    isValid: action.isValid
                }
            }
            return {
                ...state,
                inputs,
                isFormValid: Object.values(inputs).every(input => input.isValid)
            };
        }

    }
}

export default function useForm(initialInputs, initialisFormValid) {

    const [formState, dispatch] = useReducer(formReducer,
        {
            inputs: initialInputs,
            isFormValid: initialisFormValid
        })


    const changeInputHandeler = (e, id, validations) => {

        let resultValidations = []

        validations.forEach(element => {
            if (element.value === rules.requiredValue) {
                e.target.value.trim().length === 0 && resultValidations.push(false)
            }
            if (element.value === rules.maxValue) {
                e.target.value.trim().length > element.max && resultValidations.push(false)
            }
            if (element.value === rules.minValue) {
                e.target.value.trim().length < element.min && resultValidations.push(false)
            }
            if (element.value === rules.emailValue) {
                !regex.testEmail(e.target.value) && resultValidations.push(false)
            }

            if (element.value === rules.phoneValue) {
                !regex.testPhonenumber(e.target.value) && resultValidations.push(false)
            }
        });

        dispatch({
            type: "CHANGE",
            id: id,
            value: e.target.value,
            isValid: resultValidations.length ? false : true
        })
    }

    return [formState, changeInputHandeler]
}
