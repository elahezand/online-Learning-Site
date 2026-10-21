import CourseCard from "./CourseCard"

export default function CoursesList({ showData }) {
    return (
        <div className="container py-4 py-lg-5">
            {showData.length ?
                <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-3 g-4">
                    {showData.map(course => (
                        <div className="col" key={course._id}>
                            <CourseCard {...course} />
                        </div>
                    ))}
                </div> :
                <div className="alert alert-primary mb-0">No courses yet.</div>}
        </div>
    )
}
