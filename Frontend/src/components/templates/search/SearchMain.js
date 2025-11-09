import SectionHeader from '../../modules/SectionHeader/SectionHeader'
import Course from '../../modules/Course/Course'
import Article from '../../modules/Article/Article'

export default function SearchMain({ allSearchArticles, allSearchCourses, }) {
    return (
        <>
            <div className='container mt-5'>
                <SectionHeader title="Search Courses" desc="" />
                <div className='row mb-5' style={{ gap: "1rem 0" }}>
                    {allSearchCourses.length > 0 ? allSearchCourses.map((course, index) =>
                        <div className='col-4'>
                            <Course key={index} {...course} />
                        </div>
                    ) : <div className='alert alert-warning'>Not Found</div>}

                    <SectionHeader title="Search Articles" desc="" />
                    {allSearchArticles.length > 0 ? allSearchArticles.map((article, index) =>
                        <div className='col-4'>
                            <Article key={index} {...article} />
                        </div>
                    ) : <div className='alert alert-warning'>Not Found</div>}

                </div>

            </div>
        </>
    )
}
