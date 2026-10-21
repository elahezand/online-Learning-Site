import SectionHeader from "../../components/ui/SectionHeader"
import CourseCard from "../courses/CourseCard"
import ArticleCard from "../articles/ArticleCard"

function ResultGrid({ items, Card, empty }) {
    if (!items.length) return <div className="alert alert-light border mb-0">{empty}</div>
    return (
        <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-3 g-4">
            {items.map(item => <div className="col" key={item._id}><Card {...item} /></div>)}
        </div>
    )
}

export default function SearchResults({ allSearchArticles, allSearchCourses }) {
    return (
        <div className="container py-4 py-lg-5 d-grid gap-5">
            <section>
                <SectionHeader title={`Courses (${allSearchCourses.length})`} />
                <ResultGrid items={allSearchCourses} Card={CourseCard} empty="No courses found." />
            </section>
            <section>
                <SectionHeader title={`Articles (${allSearchArticles.length})`} />
                <ResultGrid items={allSearchArticles} Card={ArticleCard} empty="No articles found." />
            </section>
        </div>
    )
}
