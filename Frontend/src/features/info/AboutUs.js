import { FaCopyright, FaCrown, FaGem, FaLeaf } from "react-icons/fa6"
import SectionHeader from "../../components/ui/SectionHeader"
import AboutUsBox from "./AboutUsBox"
import useInView from "../../hooks/useInView"

const FEATURES = [
    { title: "Exclusive courses", desc: "Produced in-house with dedicated support and regular updates.", icon: <FaCopyright /> },
    { title: "Paid and free courses", desc: "We pay our instructors well to keep support and updates at the highest quality.", icon: <FaGem /> },
    { title: "Students first", desc: "Everything is built around your goals — from the first lesson to your first job.", icon: <FaCrown /> },
    { title: "Selected instructors", desc: "Only experienced, vetted instructors teach here, because quality matters.", icon: <FaLeaf /> },
]

export default function AboutUs() {
    const [isVisible, ref] = useInView()

    return (
        <section className="container py-5">
            <SectionHeader title="How can we help you?" desc="Why thousands of students learn with ACADEMIA" />
            <div ref={ref} className={`row g-4 align-items-stretch fade ${isVisible ? "show" : ""}`}>
                <div className="col-12 col-lg-6">
                    <img src="/images/blog/about.jpg.webp" alt="" className="w-100 h-100 object-fit-cover rounded-4 shadow-sm" />
                </div>
                <div className="col-12 col-lg-6">
                    <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-1 g-3 h-100">
                        {FEATURES.map(feature => <AboutUsBox key={feature.title} {...feature} />)}
                    </div>
                </div>
            </div>
        </section>
    )
}
