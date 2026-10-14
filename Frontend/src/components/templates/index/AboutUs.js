import SectionHeader from '../../modules/SectionHeader/SectionHeader'
import AboutUsBox from "../../templates/index/AboutUsBox"
import useFramer from '../../../Hooks/useFramer'

export default function AboutUs() {
    const [isShowView, ref] = useFramer()

    return (
        <section className='container page-section'>
            <SectionHeader title="How can we help you?" desc="Since the academy is a private academy.." />
            <div className={`row g-4 align-items-stretch reveal ${isShowView ? "is-visible" : ""}`} ref={ref}>
                <div className='col-12 col-lg-6'>
                    <img src="/images/blog/about.jpg.webp" alt=""
                        className="w-100 h-100 object-fit-cover rounded-3 shadow-sm about-us__img" />
                </div>

                <div className='col-12 col-lg-6 d-flex flex-column gap-3'>
                    <AboutUsBox title="Exclusive  course" desc="It is provided with high ssupport and quality." icon="far fa-copyright " />
                    <AboutUsBox title="Paid and free courses" desc="It does not mind paying its instructors to ensure the highest quality in support and course updates" icon="fas fa-gem" />
                    <AboutUsBox title=" User importance" desc="The top priority of the programming academy is giving importance to users addressing their educatinal needs,and helping them reach the job market." icon="fas fa-crown " />
                    <AboutUsBox title="Teaching permission" desc="It does not give teaching permission to just any instructor beacause quality is important to them ." icon="fas fa-leaf" />
                </div>
            </div>
        </section>
    )
}
