import { Link } from "react-router-dom"
import {
    FaArrowRight, FaBrain, FaCode, FaDatabase, FaGamepad, FaLayerGroup, FaMobileScreen,
    FaPalette, FaPython, FaServer, FaShieldHalved, FaSquareJs,
} from "react-icons/fa6"
import SectionHeader from "../../components/ui/SectionHeader"
import { useCourses } from "../courses/hooks"
import { useCategories } from "./hooks"

const ICONS = [
    [/front|html|css|react|vue/, <FaCode />],
    [/back|node|server|api/, <FaServer />],
    [/javascript|js/, <FaSquareJs />],
    [/python/, <FaPython />],
    [/security|network/, <FaShieldHalved />],
    [/mobile|android|ios|flutter/, <FaMobileScreen />],
    [/data|sql/, <FaDatabase />],
    [/ai|machine|learning/, <FaBrain />],
    [/design|ui|ux/, <FaPalette />],
    [/game/, <FaGamepad />],
]

const iconFor = (category) => {
    const text = `${category.name} ${category.title}`.toLowerCase()
    return ICONS.find(([pattern]) => pattern.test(text))?.[1] ?? <FaLayerGroup />
}

const categoryId = (course) => course.categoryID?._id ?? course.categoryID

export default function CategoryGrid() {
    const { data: categories = [] } = useCategories()
    const { data: courses = [] } = useCourses()

    if (!categories.length) return null

    const countOf = (category) => courses.filter(course => categoryId(course) === category._id).length

    return (
        <section className="container py-5">
            <SectionHeader title="Browse by category" desc="Find the path that fits your goals" />
            <div className="row row-cols-2 row-cols-md-3 row-cols-lg-4 g-3 g-md-4">
                {categories.map(category => (
                    <div className="col" key={category._id}>
                        <Link to={`/category-info/${category.name}`}
                            className="card card-hover h-100 shadow-sm text-decoration-none">
                            <div className="card-body d-flex flex-column flex-sm-row align-items-start align-items-sm-center gap-3">
                                <span className="d-inline-flex align-items-center justify-content-center rounded-3 bg-primary-subtle text-primary-emphasis fs-4 p-3 lh-1 flex-shrink-0">
                                    {iconFor(category)}
                                </span>
                                <div className="flex-grow-1 overflow-hidden">
                                    <h3 className="h6 fw-bold text-body-emphasis text-truncate mb-1">{category.title}</h3>
                                    <p className="small text-body-secondary mb-0">
                                        {countOf(category)} {countOf(category) === 1 ? "course" : "courses"}
                                    </p>
                                </div>
                                <FaArrowRight className="text-primary d-none d-sm-block flex-shrink-0" />
                            </div>
                        </Link>
                    </div>
                ))}
            </div>
        </section>
    )
}
