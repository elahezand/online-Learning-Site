import Course from "../../modules/Course/Course"
import BreadCrumb from "../../modules/BreadCrumb/BreadCrumb"

export default function CoursesMain({ showData }) {
  return (
    <div className='container mt-4'>
      <BreadCrumb links={[
        { id: 1, title: "Home", to: "/" },
        { id: 2, title: "Courses", to: "/Courses/1" },
      ]} />
      <div className='row row-cols-1 row-cols-sm-2 row-cols-lg-3 g-4'>
        {showData.length ? showData.map((course, index) =>
          <div className='col' key={index}>
            <Course {...course} />
          </div>
        ) : null}
      </div>
    </div>
  )
}
