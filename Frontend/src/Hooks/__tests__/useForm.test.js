import { act, renderHook } from "@testing-library/react"
import useForm from "../useForm"
import { requiredValidator, minValidator } from "../../validators/rules"

const change = (handler, id, value, validations) =>
    act(() => handler({ target: { value } }, id, validations))

test("form becomes valid as soon as the last field becomes valid", () => {
    const { result } = renderHook(() => useForm({
        username: { value: "", isValid: false },
        password: { value: "", isValid: false },
    }, false))

    change(result.current[1], "username", "sara", [requiredValidator()])
    expect(result.current[0].isFormValid).toBe(false)

    change(result.current[1], "password", "12345678", [requiredValidator(), minValidator(8)])
    expect(result.current[0].isFormValid).toBe(true)

    change(result.current[1], "password", "123", [requiredValidator(), minValidator(8)])
    expect(result.current[0].isFormValid).toBe(false)
})
