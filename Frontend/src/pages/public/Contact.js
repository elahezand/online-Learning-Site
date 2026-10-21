import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import PageHeader from '../../components/layout/PageHeader'
import NewsLetter from '../../features/newsletter/NewsLetter'
import ContactForm from "../../features/contacts/ContactForm"
import { useSendContact } from '../../features/contacts/hooks'
import { contactSchema } from '../../validators'

export default function Contact() {
    const navigate = useNavigate()
    const form = useForm({
        resolver: zodResolver(contactSchema),
        defaultValues: { name: "", email: "", phone: "", body: "" },
        mode: "onTouched",
    })
    const sendContact = useSendContact(() => navigate("/"))

    return (
        <>
            <PageHeader title="Contact us" subtitle="We usually answer within one business day"
                image="/images/blog/hero_1.jpg.webp"
                breadcrumb={[{ title: "Home", to: "/" }, { title: "Contact" }]} />
            <ContactForm form={form} onSubmit={(data) => sendContact.mutate(data)} isSubmitting={sendContact.isPending} />
            <NewsLetter />
        </>
    )
}
