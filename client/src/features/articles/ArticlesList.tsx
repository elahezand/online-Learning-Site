import ArticleCard from "./ArticleCard"
import type { Article } from "../../types/models"

export default function ArticlesList({ showData }: { showData: Article[] }) {
    return (
        <div className="container py-4 py-lg-5">
            {showData.length ?
                <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                    {showData.map(article => (
                        <div className="col" key={article._id}>
                            <ArticleCard {...article} />
                        </div>
                    ))}
                </div> :
                <div className="alert alert-primary mb-0">No articles yet.</div>}
        </div>
    )
}
