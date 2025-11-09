import { useState, useEffect } from 'react'
import "./LatestArticle.css"
import SectionHeader from '../../modules/SectionHeader/SectionHeader'
import Article from "../../modules/Article/Article"
import useFramer from '../../../Hooks/useFramer'
export default function LatestArticle() {
    const [isShowView, ref] = useFramer()
    const [allArticles, setAllArticles] = useState([])

    const getLatestArticle = async () => {
        const res = await fetch(`http://localhost:4000/v1/articles`)
        if (res.status === 200) {
            const data = await res.json()
            setAllArticles(data)
        }
    }
    useEffect(() => {
        getLatestArticle()
    }, [])

    return (
        <div className='container' style={{ marginTop: "10rem" }}>
            <SectionHeader
                title="Latest Articles"
                desc="Twords the Advancement of Knowledge"
                btnTitle="more articles"
                btnHref="/Articles/1"


            />
            <div className='row' ref={ref} style={{
                gap: "4rem 0", margin: "5rem", opacity: isShowView ? 1 : 0,
                transform: isShowView ? "translateY(0px)" : "translateY(80px)"
            }}>
                {allArticles.filter(article => article.publish === 1).slice(0, 3).map((article, index) => (
                    <div key={index} className='col-4'>
                        <Article {...article} />
                    </div>
                ))}
            </div>
        </div>
    )
}



