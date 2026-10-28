import { useParams } from "react-router-dom"
import PageHeader from "../../components/ui/PageHeader"
import ArticleDetail from "../../features/articles/ArticleDetail"
import { useArticle } from "../../features/articles/hooks"

export default function ArticleInfo() {
    const { articleName } = useParams()
    const { data: article } = useArticle(articleName)
    const title = article?.title ?? "Article"

    return (
        <>
            <PageHeader
                title={title}
                image="/images/blog/bg_2.jpg.webp"
                breadcrumb={[{ title: "Home", to: "/" }, { title: "Articles", to: "/articles" }, { title }]} />
            <ArticleDetail />
        </>
    )
}