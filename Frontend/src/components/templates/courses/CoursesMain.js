import Course from "../../modules/Course/Course"
import BreadCrumb from "../../modules/BreadCrumb/BreadCrumb"

export default function CoursesMain({ showData }) {


  return (
    <>
      <div className='container mt-5'>
        <BreadCrumb links={[
          { id: 1, title: "Home", to: "/" },
          { id: 2, title: "Courses", to: "/Courses" },
        ]} />
        <div className='row m-4' style={{ gap: "1rem 0" }}>
          {showData.length && showData.map((course, index) =>
            <div className='col-4'>
              <Course key={index} {...course} />
            </div>
          )}
        </div>
      </div>
    </>
  )
}
