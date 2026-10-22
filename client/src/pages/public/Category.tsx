import { useParams } from "react-router-dom"
import PageHeader from "../../components/ui/PageHeader"
import CategoryCourses from "../../features/courses/CategoryCourses"
import NewsLetter from "../../features/newsletter/NewsLetter"

export default function Category() {
    const { categoryName } = useParams()
    const title = categoryName ? categoryName.charAt(0).toUpperCase() + categoryName.slice(1) : "Category"

    return (
        <>
            <PageHeader
                title={`${title} courses`}
                image="/images/blog/cute-freelance-girl-using-laptop-sitting-floor-smiling.jpg"
                breadcrumb={[{ title: "Home", to: "/" }, { title: "Courses", to: "/courses" }, { title }]} />
            <CategoryCourses />
            <NewsLetter />
        </>
    )
}
