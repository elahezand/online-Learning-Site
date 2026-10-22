import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useLogin } from '../../features/auth/hooks'
import LoginForm from '../../features/auth/LoginForm'
import { loginSchema } from '../../validators'
import type { LoginData } from '../../validators'

export default function Login() {
    const form = useForm({
        resolver: zodResolver(loginSchema),
        defaultValues: { username: "", password: "" },
        mode: "onTouched",
    })
    const loginMutation = useLogin()

    const loginUser = (data: LoginData) => loginMutation.mutate({ identifier: data.username, password: data.password })

    return (
            <LoginForm form={form} onSubmit={loginUser} isSubmitting={loginMutation.isPending} />
    )
}
