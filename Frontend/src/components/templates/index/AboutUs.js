import "./AboutUs.css"
import SectionHeader from '../../modules/SectionHeader/SectionHeader'
import AboutUsBox from "../../templates/index/AboutUsBox"
import useFramer from '../../../Hooks/useFramer'

export default function AboutUs() {
    const [isShowView, ref] = useFramer()

    return (
        <div className='container' style={{ marginTop: "5rem" }}>
            <SectionHeader title="How can we help you?" desc="Since the academy is a private academy.." />
            <div className='row' style={{
                margin: " 0 5rem ", opacity: isShowView ? 1 : 0,
                transform: isShowView ? "translateY(0px)" : "translateY(80px)"
            }} ref={ref}>
                <div className='col-6'>
                    <div className='image-about'>
                        <img src="/images/blog/about.jpg.webp" alt="" />
                    </div>
                </div>

                <div className='col-6'>
                    <div className='row'>
                        <AboutUsBox title="Exclusive  course" desc="It is provided with high ssupport and quality." icon="far fa-copyright " />
                        <AboutUsBox title="Paid and free courses" desc="It does not mind paying its instructors to ensure the highest quality in support and course updates" icon="fas fa-gem" />
                        <AboutUsBox title=" User importance" desc="The top priority of the programming academy is giving importance to users addressing their educatinal needs,and helping them reach the job market." icon="fas fa-crown " />
                        <AboutUsBox title="Teaching permission" desc="It does not give teaching permission to just any instructor beacause quality is important to them ." icon="fas fa-leaf" />
                    </div>
                </div>
            </div>
        </div>
    )
}

