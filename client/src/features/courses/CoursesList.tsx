import { useState } from 'react'
import { useParams } from 'react-router-dom'
import Dropdown from 'react-bootstrap/Dropdown'
import { FaAlignLeft, FaBorderAll, FaMagnifyingGlass } from 'react-icons/fa6'
import Pagination from '../../components/ui/Pagination'
import FilterSelect from '../../components/ui/FilterSelect'
import useDebouncedValue from '../../hooks/useDebouncedValue'
import CourseCard from "./CourseCard"
import useListParams from '../../hooks/useListParams'
import { useCourses } from './hooks'
import type { CourseQuery } from './hooks'
import { useCategories } from '../categories/hooks'

const SORT_OPTIONS: { value: NonNullable<CourseQuery["sort"]>; label: string }[] = [
    { value: "newest", label: "Latest" },
    { value: "oldest", label: "Oldest" },
    { value: "price-asc", label: "Price: low to high" },
    { value: "price-desc", label: "Price: high to low" },
]

const PRICE_OPTIONS = [
    { value: "free", label: "Free" },
    { value: "paid", label: "Paid" },
]

const PRICE_QUERY: Record<string, CourseQuery["free"]> = { free: 1, paid: 0 }

const PAGE_SIZE = 9

export default function CoursesList() {
    const { categoryName } = useParams()
    const [direction, setDirection] = useState<"row" | "column">("row")

    const { page, get, update } = useListParams()
    const search = useDebouncedValue(get("search").trim())
    const category = categoryName ?? get("category")
    const price = get("price")
    const sort = SORT_OPTIONS.find(option => option.value === get("sort")) ?? SORT_OPTIONS[0]

    const { data: categories = [] } = useCategories()
    const { data, isLoading } = useCourses({
        category: category || undefined,
        page,
        limit: PAGE_SIZE,
        search: search || undefined,
        sort: sort.value,
        free: PRICE_QUERY[price],
    })
    const courses = data?.items ?? []

    const isFiltered = Boolean(search) || Boolean(price) || (!categoryName && Boolean(category))

    if (!isLoading && !courses.length && !isFiltered) {
        return (
            <div className="container py-4 py-lg-5">
                <div className="alert alert-primary mb-0">
                    {categoryName ? "There are no courses in this category yet." : "There are no courses yet."}
                </div>
            </div>
        )
    }

    return (
        <div className="container py-4 py-lg-5">
            <div className="card shadow-sm">
                <div className="card-body d-flex flex-column flex-md-row align-items-stretch align-items-md-center gap-3">
                    <form className="flex-grow-1" role="search" onSubmit={(e) => e.preventDefault()}>
                        <div className="input-group">
                            <span className="input-group-text bg-body"><FaMagnifyingGlass /></span>
                            <input type="search" className="form-control border-start-0"
                                value={get("search")}
                                onChange={(e) => update({ search: e.target.value })}
                                placeholder="Search courses…" aria-label="Search courses" />
                        </div>
                    </form>
                    <div className="d-flex flex-wrap align-items-center gap-2">
                        {!categoryName &&
                            <FilterSelect label="Filter by category" allLabel="All categories" value={category}
                                onChange={(value) => update({ category: value })}
                                options={categories.map(item => ({ value: item.name, label: item.title }))} />}
                        <FilterSelect label="Filter by price" allLabel="All prices" value={price}
                            onChange={(value) => update({ price: value })}
                            options={PRICE_OPTIONS} />
                        <div className="btn-group" role="group" aria-label="Layout">
                            <button type="button"
                                className={`btn ${direction === "row" ? "btn-primary" : "btn-outline-secondary"}`}
                                onClick={() => setDirection("row")} aria-label="Grid view" aria-pressed={direction === "row"}>
                                <FaBorderAll />
                            </button>
                            <button type="button"
                                className={`btn ${direction === "column" ? "btn-primary" : "btn-outline-secondary"}`}
                                onClick={() => setDirection("column")} aria-label="List view" aria-pressed={direction === "column"}>
                                <FaAlignLeft />
                            </button>
                        </div>
                        <Dropdown align="end" className="flex-grow-1 flex-md-grow-0">
                            <Dropdown.Toggle variant="outline-secondary" className="w-100 text-nowrap">
                                {sort.label}
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                {SORT_OPTIONS.map(option => (
                                    <Dropdown.Item as="button" key={option.value}
                                        active={sort.value === option.value}
                                        onClick={() => update({ sort: option.value === "newest" ? "" : option.value })}>
                                        {option.label}
                                    </Dropdown.Item>
                                ))}
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>
                </div>
            </div>

            <div className={`row g-4 mt-1 ${direction === "row" ? "row-cols-1 row-cols-sm-2 row-cols-lg-3" : "row-cols-1"}`}>
                {isLoading ?
                    <div className="col-12 text-center py-5"><div className="spinner-border text-primary" role="status" aria-label="Loading" /></div> :
                    courses.length ?
                        courses.map(course => (
                            <div className="col" key={course._id}>
                                <CourseCard {...course} direction={direction} />
                            </div>
                        )) :
                        <div className="col-12"><div className="alert alert-warning mb-0">No courses match your filters.</div></div>}
            </div>

            <Pagination pagination={data?.pagination} />
        </div>
    )
}
