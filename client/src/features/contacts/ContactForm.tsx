import { FaEnvelope, FaPaperPlane, FaPhone, FaUser } from "react-icons/fa6"
import type { SubmitHandler, UseFormReturn } from "react-hook-form"
import Input from "../../components/ui/Input"
import type { ContactData, ContactFormValues } from "../../validators"

interface ContactFormProps {
    form: UseFormReturn<ContactFormValues, unknown, ContactData>
    onSubmit: SubmitHandler<ContactData>
    isSubmitting: boolean
}

export default function ContactForm({ form, onSubmit, isSubmitting }: ContactFormProps) {
    const { register, handleSubmit, formState: { errors } } = form

    return (
        <section className="container py-5">
            <div className="card shadow overflow-hidden">
                <div className="card-body p-3 p-sm-4 p-lg-5">
                    <h2 className="h4 fw-bold mb-1">Send us a message</h2>
                    <p className="text-body-secondary mb-4">Questions, feedback or partnership — we read everything.</p>

                    <form className="d-grid gap-3" onSubmit={handleSubmit(onSubmit)} noValidate>
                        <div className="input-group has-validation">
                            <span className="input-group-text"><FaUser /></span>
                            <Input placeholder="Your name" aria-label="Your name" autoComplete="name" {...register("name")} error={errors.name?.message} />
                        </div>
                        <div className="row g-3">
                            <div className="col-sm-6">
                                <div className="input-group has-validation">
                                    <span className="input-group-text"><FaEnvelope /></span>
                                    <Input type="email" placeholder="Email" aria-label="Email" autoComplete="email" {...register("email")} error={errors.email?.message} />
                                </div>
                            </div>
                            <div className="col-sm-6">
                                <div className="input-group has-validation">
                                    <span className="input-group-text"><FaPhone /></span>
                                    <Input type="tel" placeholder="Phone number" aria-label="Phone number" autoComplete="tel" {...register("phone")} error={errors.phone?.message} />
                                </div>
                            </div>
                        </div>
                        <div>
                            <Input as="textarea" rows={6} placeholder="Your message" aria-label="Your message" {...register("body")} error={errors.body?.message} />
                        </div>

                        <button type="submit" className="btn btn-primary btn-lg d-inline-flex align-items-center justify-content-center gap-2"
                            disabled={isSubmitting}>
                            <FaPaperPlane /> Send message
                        </button>
                    </form>
                </div>
            </div>
        </section>
    )
}
