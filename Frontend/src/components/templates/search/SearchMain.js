import SectionHeader from '../../modules/SectionHeader/SectionHeader'
import Course from '../../modules/Course/Course'
import Article from '../../modules/Article/Article'

export default function SearchMain({ allSearchArticles, allSearchCourses, }) {
    return (
        <div className='container mt-4 mb-5'>
            <SectionHeader title="Search Courses" desc="" />
            {allSearchCourses.length > 0 ?
                <div className='row row-cols-1 row-cols-sm-2 row-cols-lg-3 g-4'>
                    {allSearchCourses.map((course, index) =>
                        <div className='col' key={index}>
                            <Course {...course} />
                        </div>
                    )}
                </div> : <div className='alert alert-warning'>Not Found</div>}

            <SectionHeader title="Search Articles" desc="" />
            {allSearchArticles.length > 0 ?
                <div className='row row-cols-1 row-cols-sm-2 row-cols-lg-3 g-4'>
                    {allSearchArticles.map((article, index) =>
                        <div className='col' key={index}>
                            <Article {...article} />
                        </div>
                    )}
                </div> : <div className='alert alert-warning'>Not Found</div>}
        </div>
    )
}
