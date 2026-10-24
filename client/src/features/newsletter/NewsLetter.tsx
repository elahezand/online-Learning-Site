import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { FaPaperPlane } from "react-icons/fa6"
import { newsletterSchema } from "../../validators"
import { useSubscribeNewsletter } from "./hooks"

export default function NewsLetter() {
    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        resolver: zodResolver(newsletterSchema),
        defaultValues: { email: "" },
    })
    const subscribe = useSubscribeNewsletter(() => reset())

    return (
        <section className="container my-5">
            <div className=" rounded-4 shadow p-4 p-md-5">
                <div className="row align-items-center g-4">
                    <div className="col-12 col-lg-6">
                        <h2 className="h3 fw-bold mb-2">Stay in the loop</h2>
                        <p className="mb-0">New courses, discounts and articles — once a week, no spam.</p>
                    </div>
                    <div className="col-12 col-lg-6">
                        <form onSubmit={handleSubmit(data => subscribe.mutate(data))} noValidate>
                            <div className="input-group input-group-lg">
                                <input type="email" className="form-control" placeholder="Your email address" aria-label="Email address"
                                    aria-invalid={Boolean(errors.email)} {...register("email")} />
                                <button type="submit" className="btn btn-primary d-inline-flex align-items-center gap-2" disabled={subscribe.isPending}>
                                    <FaPaperPlane /><span className="d-none d-sm-inline">Subscribe</span>
                                </button>
                            </div>
                            {errors.email && <div className="small text-white fw-medium mt-2">{errors.email.message}</div>}
                        </form>
                    </div>
                </div>
            </div>
        </section>
    )
}
