import { useReducer } from 'react'
import regex from '../validators/regex'
import rules from '../validators/rules'

const formReducer = (state, action) => {
    switch (action.type) {
        default: {
            return state
        }
        case "CHANGE": {
            let isFormValid = true
            for (const inputID in state.inputs) {
                if (!state.inputs[inputID].isValid) {
                    isFormValid = false
                    break
                }
            }
            return {
                ...state,
                inputs: {
                    ...state.inputs,
                    [action.id]: {
                        value: action.value,
                        isValid: action.isValid
                    }
                },
                isFormValid: isFormValid
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
