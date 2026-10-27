import { useArticles } from "./hooks"
import SectionHeader from "../../components/ui/SectionHeader"
import ArticleCard from "./ArticleCard"

export default function LatestArticles() {
    const { data } = useArticles({ limit: 3 })
    const articles = data?.items ?? []
    if (!articles.length) return null

    return (
        <section className="container py-5">
            <SectionHeader title="Latest articles" desc="Towards the advancement of knowledge" btnTitle="All articles" btnHref="/articles" />
            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                {articles.map(article => (
                    <div key={article._id} className="col">
                        <ArticleCard {...article} />
                    </div>
                ))}
            </div>
        </section>
    )
}