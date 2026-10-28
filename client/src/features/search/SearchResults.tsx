import SectionHeader from "../../components/ui/SectionHeader"
import CourseCard from "../courses/CourseCard"
import ArticleCard from "../articles/ArticleCard"
import type { ComponentType } from "react"
import type { Article, Course } from "../../types/models"

interface ResultGridProps<T extends { _id: string }> {
    items: T[]
    Card: ComponentType<T>
    empty: string
}

function ResultGrid<T extends { _id: string }>({ items, Card, empty }: ResultGridProps<T>) {
    if (!items.length) return <div className="alert alert-light border mb-0">{empty}</div>
    return (
        <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-3 g-4">
            {items.map(item => <div className="col" key={item._id}><Card {...item} /></div>)}
        </div>
    )
}


interface SearchResultsProps {
    courses: Course[]
    articles: Article[]
}

export default function SearchResults({ courses, articles }: SearchResultsProps) {
    return (
        <div className="container py-4 py-lg-5 d-grid gap-5">
            <section>
                <SectionHeader title={`Courses (${courses.length})`} />
                <ResultGrid items={courses} Card={CourseCard} empty="No courses found." />
            </section>
            <section>
                <SectionHeader title={`Articles (${articles.length})`} />
                <ResultGrid items={articles} Card={ArticleCard} empty="No articles found." />
            </section>
        </div>
    )
}
