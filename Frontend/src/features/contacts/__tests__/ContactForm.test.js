import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { contactSchema } from "../../../validators"
import ContactForm from "../ContactForm"

function Harness({ onSubmit }) {
    const form = useForm({
        resolver: zodResolver(contactSchema),
        defaultValues: { name: "", email: "", phone: "", body: "" },
        mode: "onTouched",
    })
    return <ContactForm form={form} onSubmit={onSubmit} isSubmitting={false} />
}

test("shows zod errors and does not submit invalid data", async () => {
    const onSubmit = jest.fn()
    render(<Harness onSubmit={onSubmit} />)

    await userEvent.type(screen.getByLabelText("Email"), "sara@")
    await userEvent.click(screen.getByRole("button", { name: /send message/i }))

    expect(await screen.findByText("Name is required")).toBeInTheDocument()
    expect(screen.getByText("Enter a valid email address")).toBeInTheDocument()
    expect(onSubmit).not.toHaveBeenCalled()
})

test("submits trimmed, valid data", async () => {
    const onSubmit = jest.fn()
    render(<Harness onSubmit={onSubmit} />)

    await userEvent.type(screen.getByLabelText("Your name"), "  Sara Ahmadi ")
    await userEvent.type(screen.getByLabelText("Email"), "sara@mail.com")
    await userEvent.type(screen.getByLabelText("Phone number"), "09121234567")
    await userEvent.type(screen.getByLabelText("Your message"), "Hello, I have a question about React.")
    await userEvent.click(screen.getByRole("button", { name: /send message/i }))

    await waitFor(() => expect(onSubmit).toHaveBeenCalled())
    expect(onSubmit.mock.calls[0][0]).toEqual({
        name: "Sara Ahmadi",
        email: "sara@mail.com",
        phone: "09121234567",
        body: "Hello, I have a question about React.",
    })
})
