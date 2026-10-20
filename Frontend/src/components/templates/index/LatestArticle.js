import { useArticles } from '../../../api'
import SectionHeader from '../../modules/SectionHeader/SectionHeader'
import Article from "../../modules/Article/Article"
import useFramer from '../../../Hooks/useFramer'

export default function LatestArticle() {
    const [isShowView, ref] = useFramer()
    const { data: allArticles = [] } = useArticles()

    return (
        <section className='container page-section'>
            <SectionHeader
                title="Latest Articles"
                desc="Twords the Advancement of Knowledge"
                btnTitle="more articles"
                btnHref="/Articles/1" />
            <div ref={ref}
                className={`row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 reveal ${isShowView ? "is-visible" : ""}`}>
                {allArticles.filter(article => article.publish === 1).slice(0, 3).map((article, index) => (
                    <div key={index} className='col'>
                        <Article {...article} />
                    </div>
                ))}
            </div>
        </section>
    )
}
