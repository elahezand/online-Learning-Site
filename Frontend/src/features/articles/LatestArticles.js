import { useArticles } from "./hooks"
import SectionHeader from "../../components/ui/SectionHeader"
import ArticleCard from "./ArticleCard"
import useInView from "../../hooks/useInView"

export default function LatestArticles() {
    const [isVisible, ref] = useInView()
    const { data: articles = [] } = useArticles()
    const published = articles.filter(article => article.publish === 1).slice(0, 3)
    if (!published.length) return null

    return (
        <section className="container py-5">
            <SectionHeader title="Latest articles" desc="Towards the advancement of knowledge" btnTitle="All articles" btnHref="/articles" />
            <div ref={ref} className={`row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 fade ${isVisible ? "show" : ""}`}>
                {published.map(article => (
                    <div key={article._id} className="col">
                        <ArticleCard {...article} />
                    </div>
                ))}
            </div>
        </section>
    )
}
