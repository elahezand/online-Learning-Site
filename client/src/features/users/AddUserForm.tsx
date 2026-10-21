import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import type { ReactNode } from "react"
import { FaAt, FaEnvelope, FaLock, FaPhone, FaPlus, FaUser, FaUserPlus } from "react-icons/fa6"
import Input from "../../components/ui/Input"
import FormCard from "../../components/ui/FormCard"
import { userSchema } from "../../validators"
import type { UserData, UserFormValues } from "../../validators"
import { useCreateUser } from "./hooks"

const defaultValues: UserFormValues = { name: "", username: "", email: "", phone: "", password: "" }

const fields: { name: keyof UserFormValues; placeholder: string; icon: ReactNode; type?: string }[] = [
    { name: "name", placeholder: "Full name", icon: <FaUser /> },
    { name: "username", placeholder: "Username", icon: <FaAt /> },
    { name: "email", placeholder: "Email", icon: <FaEnvelope />, type: "email" },
    { name: "phone", placeholder: "Phone", icon: <FaPhone />, type: "tel" },
    { name: "password", placeholder: "Password", icon: <FaLock />, type: "password" },
]

export default function AddUserForm() {
    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        resolver: zodResolver(userSchema),
        defaultValues,
        mode: "onTouched",
    })
    const createUser = useCreateUser(() => reset())

    const onSubmit = (data: UserData) => createUser.mutate({ ...data, confirmPassword: data.password })

    return (
        <FormCard icon={<FaUserPlus />} title="Add New User">
            <form className="d-grid gap-3" onSubmit={handleSubmit(onSubmit)} noValidate>
                <div className="row g-3">
                    {fields.map(field => (
                        <div className="col-12 col-md-6" key={field.name}>
                            <div className="input-group has-validation">
                                <span className="input-group-text">{field.icon}</span>
                                <Input type={field.type ?? "text"} placeholder={field.placeholder} aria-label={field.placeholder}
                                    {...register(field.name)} error={errors[field.name]?.message} />
                            </div>
                        </div>
                    ))}
                </div>
                <div>
                    <button type="submit" className="btn btn-primary d-inline-flex align-items-center gap-2" disabled={createUser.isPending}>
                        <FaPlus /> Add user
                    </button>
                </div>
            </form>
        </FormCard>
    )
}
