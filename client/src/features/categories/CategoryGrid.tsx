import { useMemo } from "react"
import { Link } from "react-router-dom"
import type { IconType } from "react-icons"
import {
    FaArrowRight, FaBrain, FaCode, FaDatabase, FaGamepad, FaLayerGroup, FaMobileScreen,
    FaPalette, FaPython, FaServer, FaShieldHalved, FaSquareJs,
} from "react-icons/fa6"
import SectionHeader from "../../components/ui/SectionHeader"
import { useCourses } from "../courses/hooks"
import { useCategories } from "./hooks"
import type { Category } from "../../types/models"
import { categoryIdOf } from "../courses/courseView"

interface RankedCategory extends Category {
    Icon: IconType
    count: number
}

const ICONS: [RegExp, IconType][] = [
    [/front|html|css|react|vue/, FaCode],
    [/back|node|server|api/, FaServer],
    [/javascript|js/, FaSquareJs],
    [/python/, FaPython],
    [/security|network/, FaShieldHalved],
    [/mobile|android|ios|flutter/, FaMobileScreen],
    [/data|sql/, FaDatabase],
    [/ai|machine|learning/, FaBrain],
    [/design|ui|ux/, FaPalette],
    [/game/, FaGamepad],
]

const EMPTY: never[] = []

const iconFor = (category: Category) => {
    const text = `${category.name} ${category.title}`.toLowerCase()
    return ICONS.find(([pattern]) => pattern.test(text))?.[1] ?? FaLayerGroup
}

const countLabel = (count: number) => (count ? `${count} ${count === 1 ? "course" : "courses"}` : "Coming soon")

function FeaturedTile({ category }: { category: RankedCategory }) {
    const Icon = category.Icon
    return (
        <Link to={`/category-info/${category.name}`}
            className="card card-hover h-100 border-0 rounded-4 shadow bg-primary bg-gradient text-white text-decoration-none overflow-hidden position-relative">
            <Icon className="position-absolute bottom-0 end-0 m-3 display-1 opacity-25" aria-hidden="true" />
            <div className="card-body d-flex flex-column p-4 p-lg-5 position-relative">
                <span className="badge rounded-pill bg-white bg-opacity-25 text-white align-self-start mb-4">Most popular</span>
                <span className="d-inline-flex align-items-center justify-content-center rounded-circle bg-white bg-opacity-25 fs-2 p-3 lh-1 align-self-start mb-3">
                    <Icon />
                </span>
                <h3 className="h2 fw-bold text-white mb-1">{category.title}</h3>
                <p className="text-white text-opacity-75 mb-4">{countLabel(category.count)}</p>
                <span className="btn btn-light fw-medium d-inline-flex align-items-center gap-2 align-self-start mt-auto">
                    Explore <FaArrowRight />
                </span>
            </div>
        </Link>
    )
}

function Tile({ category }: { category: RankedCategory }) {
    const Icon = category.Icon
    return (
        <Link to={`/category-info/${category.name}`}
            className="card card-hover h-100 rounded-4 shadow-sm text-decoration-none overflow-hidden position-relative">
            <Icon className="position-absolute bottom-0 end-0 m-2 display-4 text-primary opacity-25" aria-hidden="true" />
            <div className="card-body d-flex flex-column gap-3 p-3 p-lg-4 position-relative">
                <span className="d-inline-flex align-items-center justify-content-center rounded-3 bg-primary-subtle text-primary-emphasis fs-4 p-3 lh-1 align-self-start">
                    <Icon />
                </span>
                <div className="mt-auto">
                    <h3 className="h6 fw-bold text-body-emphasis text-truncate mb-1">{category.title}</h3>
                    <span className={`small ${category.count ? "text-body-secondary" : "text-primary-emphasis fw-medium"}`}>
                        {countLabel(category.count)}
                    </span>
                </div>
            </div>
        </Link>
    )
}

export default function CategoryGrid() {
    const { data: categories = EMPTY } = useCategories()
    const { data: courses = EMPTY } = useCourses()

    const ranked = useMemo<RankedCategory[]>(() => categories
        .map(category => ({
            ...category,
            Icon: iconFor(category),
            count: courses.filter(course => categoryIdOf(course) === category._id).length,
        }))
        .sort((a, b) => b.count - a.count), [categories, courses])

    if (!ranked.length) return null

    const [featured, ...others] = ranked
    const tiles = others.slice(0, 4)
    const more = others.slice(4)

    return (
        <section className="container py-5">
            <SectionHeader title="Browse by category" desc="Find the path that fits your goals" btnTitle="All courses" btnHref="/courses" />

            <div className="row g-3 g-lg-4">
                <div className="col-12 col-lg-5">
                    <FeaturedTile category={featured} />
                </div>
                {tiles.length > 0 &&
                    <div className="col-12 col-lg-7">
                        <div className="row row-cols-2 g-3 g-lg-4 h-100">
                            {tiles.map(category => (
                                <div className="col" key={category._id}>
                                    <Tile category={category} />
                                </div>
                            ))}
                        </div>
                    </div>}
            </div>

            {more.length > 0 &&
                <div className="d-flex flex-wrap align-items-center gap-2 mt-4">
                    <span className="small fw-medium text-body-secondary me-1">More topics:</span>
                    {more.map(category => (
                        <Link key={category._id} to={`/category-info/${category.name}`}
                            className="btn btn-sm btn-outline-secondary rounded-pill d-inline-flex align-items-center gap-2">
                            <category.Icon className="text-primary" /> {category.title}
                            {category.count > 0 && <span className="badge rounded-pill bg-primary-subtle text-primary-emphasis">{category.count}</span>}
                        </Link>
                    ))}
                </div>}
        </section>
    )
}