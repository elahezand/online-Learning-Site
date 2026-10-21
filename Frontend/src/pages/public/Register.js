import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import PageHeader from '../../components/layout/PageHeader'
import { useRegister } from '../../features/auth/hooks'
import RegisterForm from '../../features/auth/RegisterForm'
import { registerSchema } from '../../validators'

const defaultValues = { name: "", username: "", email: "", phonenumber: "", password: "" }

export default function Register() {
    const form = useForm({ resolver: zodResolver(registerSchema), defaultValues, mode: "onTouched" })
    const registerMutation = useRegister()

    const registerNewUser = ({ phonenumber, ...data }) =>
        registerMutation.mutate({ ...data, phone: phonenumber, confirmPassword: data.password })

    return (
        <>
            <PageHeader title="Create your account" image="/images/blog/hero_1.jpg.webp"
                breadcrumb={[{ title: "Home", to: "/" }, { title: "Register" }]} />
            <RegisterForm form={form} onSubmit={registerNewUser} isSubmitting={registerMutation.isPending} />
        </>
    )
}
