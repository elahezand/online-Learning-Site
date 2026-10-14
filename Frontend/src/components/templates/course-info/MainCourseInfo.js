import { useState, useEffect } from 'react'
import BreadCrumb from '../../modules/BreadCrumb/BreadCrumb';
import CourseDetailBox from "../../templates/course-info/CourseDetailBox"
import AccordionItem from "../../templates/course-info/AccordionItem"
import Comments from "../../templates/course-info/Comments"
import { Link, useNavigate, useParams } from 'react-router-dom'
import Accordion from 'react-bootstrap/Accordion';
import getMe from "../../../utils/auth"
import swal from 'sweetalert'

export default function MainCourseInfo() {
  const params = useParams()
  const navigator = useNavigate()

  const [courseInfo, setCourseInfo] = useState({})
  const [categoryInfo, setCategoryInfo] = useState({})
  const [relatedCourses, setRelatedCourses] = useState([])


  const [courseComments, setCurseComments] = useState([])
  const [courseSessions, setCurseSessions] = useState([])
  const [updatedAt, setUpdatedAt] = useState("")
  const [createdAt, setCreatedAt] = useState("")
  const [courseTeacher, setCourseTeacher] = useState({})


  const getCourseDetail = async () => {
    const token = await getMe()
    if (token) {
      const res = await fetch(`http://localhost:4000/v1/courses/${params.courseName}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      if (res.status === 200) {
        const data = await res.json()
        setCourseInfo(data)
        setCategoryInfo(data.categoryID)
        setCurseComments(data.comments)
        setCurseSessions(data.sessions)
        setUpdatedAt(data.updatedAt.slice(0, 10))
        setCreatedAt(data.createdAt)
        setCourseTeacher(data.creator)
      }
    }
  }

  const getRelatedCourse = async () => {
    const res = await fetch(`http://localhost:4000/v1/courses/related/${params.courseName}`)
    if (res.status === 200) {
      const data = await res.json()
      setRelatedCourses(data)
    }
  }

  useEffect(() => {
    getCourseDetail()
    getRelatedCourse()
  }, [params.courseName])


  const registerToCourse = async () => {
    const token = await getMe()
    if (token) {
      if (courseInfo.price === 0) {
        const res = await fetch(`http://localhost:4000/v1/courses/${courseInfo._id}/register`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ price: courseInfo.price })

        })
        if (res.status === 200) {
          swal({
            title: "you are registred successfully",
            icon: "success",
            buttons: "ok"
          })
          getCourseDetail()
        }
        else {
          swal({
            title: "someThing Went Wrong !",
            icon: "warning",
            buttons: "Try again"
          })
        }
      }
      else {
        swal({
          title: "Please send Discount Code :)",
          content: "input",
          buttons: ["Without Discount Code", "Submit"]
        })
          .then(async result => {
            if (result === null) {
              const res = await fetch(`http://localhost:4000/v1/courses/${courseInfo._id}/register`, {
                method: "POST",
                headers: {
                  "Authorization": `Bearer ${token}`,
                  "Content-Type": "application/json"
                },
                body: JSON.stringify({ price: courseInfo.price })
              })
              if (res.status === 201) {
                swal({
                  title: "you are registred successfully",
                  icon: "success",
                  buttons: "ok"
                })
                getCourseDetail()
              }
              else {
                swal({
                  title: "something Went Wrong!",
                  icon: "warning",
                  buttons: "Try again"
                })
              }
            }
            else {
              const res = await fetch(`http://localhost:4000/v1/offs/${result}`, {
                method: "POST",
                headers: {
                  "Authorization": `Bearer ${token}`,
                  "Content-Type": "application/json"
                },
                body: JSON.stringify(
                  { course: courseInfo._id }
                )
              })

              const data = await res.json()
              if (res.ok) {
                const priceData = (courseInfo.price) - ((courseInfo.price * data.percent) / 100)

                const res = await fetch(`http://localhost:4000/v1/courses/${courseInfo._id}/register`, {
                  method: "POST",
                  headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                  },
                  body: JSON.stringify({ price: priceData })
                })
                if (res.status === 201) {
                  swal({
                    title: "you are registred successfully",
                    icon: "success",
                    buttons: "ok"
                  })
                  getCourseDetail()
                }
              }
              else {
                swal({
                  title: "This code is not valid !!",
                  icon: "warning",
                  buttons: "ok"
                })
              }
            }
          })
      }
    }
    else {
      swal({
        title: "plaese loginIn First",
        icon: "success",
        buttons: "ok"
      }).then(result => {
        if (result) {
          navigator("/login")
        }
      })
    }
  }



  return (
    <div className="container mt-4">
      <BreadCrumb links={[
        { id: 1, title: "Home", to: "/" },
        { id: 2, title: "Frontend", to: "/category-info/frontend/1" },
        { id: 3, title: "Html", to: "/course-info/Html/1" },
      ]} />

      <section className="row g-4 align-items-center mb-4" id="main-course">
        <div className="col-12 col-lg-6">
          <video src='#'
            poster={`http://localhost:4000/courses/covers/${courseInfo.cover}`}
            className="course-hero__video"></video>
        </div>

        <div className="col-12 col-lg-6">
          {categoryInfo.title &&
            <Link to={"/"} className="badge rounded-pill text-bg-primary course-hero__category">
              {categoryInfo.title}
            </Link>}
          <h1 className="course-hero__title">
            {courseInfo.name}
          </h1>
          <p className="text-body-secondary">
            {courseInfo.description}
          </p>
          <div className="d-flex gap-2">
            <Link to={"/"} className="icon-btn" aria-label="Telegram">
              <i className="fab fa-telegram-plane"></i>
            </Link>
            <Link to={"/"} className="icon-btn" aria-label="Twitter">
              <i className="fab fa-twitter"></i>
            </Link>
            <Link to={"/"} className="icon-btn" aria-label="Facebook">
              <i className="fab fa-facebook-f"></i>
            </Link>
          </div>
        </div>
      </section>

      <div className="row g-4">
        <aside className='col-12 col-lg-4'>
          <div className="course-sidebar d-flex flex-column gap-3">
            <div className="card info-card">
              {courseInfo.isUserRegisteredToThisCourse ?
                <div className="course-register course-register--done">
                  <i className="fa-solid fa-circle-check"></i>
                  you are a student of the course
                </div>
                :
                <button type="button" className='course-register'
                  onClick={() => registerToCourse()}>
                  <i className="fa-solid fa-graduation-cap"></i>
                  Plaese register to this course :)
                </button>}
            </div>

            <div className="card info-card p-3">
              <div className="d-flex align-items-center justify-content-center gap-2 p-3 rounded-3 border border-primary-subtle">
                <i className="fas fa-user-graduate fs-3 text-primary-strong"></i>
                <span className="text-heading">Students</span>
                <span className="badge rounded-pill bg-primary-subtle-token text-primary-strong fs-6">
                  {courseInfo.courseStudentsCount}
                </span>
              </div>
              <div className="d-flex justify-content-around pt-3 text-body-secondary">
                <span className="d-inline-flex align-items-center gap-2">
                  <i className="far fa-comments fs-5"></i>
                  {courseComments.length}
                </span>
                <span className="vr"></span>
                <span className="d-inline-flex align-items-center gap-2">
                  <i className="far fa-eye fs-5"></i>
                  14,234 View
                </span>
              </div>
            </div>

            <div className="card info-card p-3">
              <div className="d-flex align-items-center gap-2 text-heading fw-medium">
                <i className="fas fa-link text-primary-strong"></i>
                Link
              </div>
              <span className="course-short-url">
                https://Academia.com/?p=117472
              </span>
            </div>

            <div className="card info-card p-3">
              <span className="info-card__title">
                Courses Topics
              </span>
              <span className="text-body-secondary">
                Download Click :
                <Link to="#" className="fw-bold ms-2">
                  Link
                </Link>
              </span>
            </div>

            <div className="card info-card p-3">
              <span className="info-card__title">Related Courses</span>
              <ul className="list-unstyled mb-0 d-flex flex-column">
                {relatedCourses.length ? relatedCourses.map((course, index) => (
                  <li key={index}>
                    <Link
                      to={`/course-info/${course.shortName}/1`}
                      className="related-course">
                      <img
                        src={`http://localhost:4000/courses/covers/${course.cover}`}
                        alt=""
                        className="related-course__img" />
                      <span className="related-course__name">
                        {course.name}
                      </span>
                    </Link>
                  </li>
                )) : <li className="text-body-secondary small">there isn't any related courses !</li>}
              </ul>
            </div>
          </div>
        </aside>

        <div className="col-12 col-lg-8">
          <div className="row row-cols-1 row-cols-sm-2 row-cols-xl-3 g-3">
            <CourseDetailBox title="Status"
              subtitle={courseInfo.isComplete === "1" ? "completed" : "uncompleted"}
              icon="fas fa-graduation-cap" />
            <CourseDetailBox
              title="CreatedAt"
              subtitle={createdAt.slice(0, 10)}
              icon="fas fa-clock" />
            <CourseDetailBox
              title="Latest update"
              subtitle={updatedAt}
              icon="fas fa-calendar-days" />
            <CourseDetailBox
              title="Suport"
              subtitle={courseInfo.support}
              icon="fas fa-user-large" />
            <CourseDetailBox
              title="Prerequisite"
              subtitle="Html Css"
              icon="fas fa-circle-info " />
            <CourseDetailBox title="Type of observation"
              subtitle="Online" icon="fas fa-play " />
          </div>

          <div className="card info-card p-3 p-sm-4 my-4">
            <div className="d-flex align-items-center gap-3 mb-3">
              <i className="fas fa-chart-line fs-4 text-primary-strong"></i>
              <span className="text-heading fw-medium">
                Courses progress percentage
              </span>
            </div>
            <div className="progress" style={{ height: "0.6rem" }}>
              <div className="progress-bar progress-bar-striped progress-bar-animated"
                role="progressbar" aria-label="Course progress"
                aria-valuenow="75" aria-valuemin="0" aria-valuemax="100"
                style={{ width: "75%" }}>
              </div>
            </div>
          </div>

          <div className="card info-card p-3 p-sm-4">
            <div className="mb-4">
              <h2 className="section-title h5 mb-3">
                Lorem ipsum dolor sit amet consectetur adipisicing.
              </h2>
              <img
                src={`http://localhost:4000/courses/covers/${courseInfo.cover}`}
                alt=""
                className="img-fluid rounded-3 my-3" />
              <p className="text-body-secondary">
                Lorem ipsum dolor sit amet consectetur
                adipisicing elit. Voluptates enim natus explicabo a culpa quisquam velit, voluptatem et libero sint dolorum reprehenderit neque quibusdam reiciendis qui distinctio maiores earum eveniet?
              </p>
              <p className="text-body-secondary">
                Lorem, ipsum dolor sit amet consectetur adipisicing elit. Rerum, tempore atque porro explicabo aliquid ducimus veniam laborum, reprehenderit consectetur saepe itaque nostrum veritatis vitae omnis quidem quae quia aliquam ipsum!
              </p>
            </div>

            <div className="mb-4">
              <h2 className="section-title h5 mb-3">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Perspiciatis, dolore.
              </h2>
              <p className="text-body-secondary">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem, quos error distinctio magni culpa aperiam! Reprehenderit, cumque dignissimos voluptatem officiis nesciunt quis blanditiis, consequuntur ea id, facilis nihil maxime est!
              </p>
            </div>

            <div className="mb-4">
              <Link to="#" className="btn btn-outline-primary">
                <i className="fa-solid fa-download me-2"></i>
                Download All Videos</Link>
            </div>

            <Accordion defaultActiveKey="one" className="course-sessions">
              <Accordion.Item eventKey="one">
                <Accordion.Header>Course Introduction</Accordion.Header>
                {courseSessions.map((session, index) => (
                  <AccordionItem key={index}
                    {...session}
                    number={index + 1}
                    isUserRegisteredToThisCourse
                    ={courseInfo.isUserRegisteredToThisCourse} />
                ))}
              </Accordion.Item>
            </Accordion>
          </div>

          <div className="card info-card p-3 p-sm-4 mt-4">
            <div className="d-flex flex-wrap align-items-start justify-content-between gap-3">
              <div className="d-flex align-items-center gap-3">
                {courseTeacher.profile ?
                  <img src={courseTeacher.profile} alt=""
                    className="teacher__img" /> :
                  <span className="icon-badge icon-badge--lg rounded-circle"><i className="fa-solid fa-user"></i></span>}
                <div className="d-flex flex-column">
                  <Link to="#" className="fw-bold text-heading">
                    {courseTeacher.name}</Link>
                  <span className="small text-body-secondary">
                    Frontend & Backend Developer
                  </span>
                </div>
              </div>
              <span className="badge text-bg-primary d-inline-flex align-items-center gap-2 px-3 py-2 fs-7">
                <i className="fas fa-chalkboard-teacher"></i>
                Teacher
              </span>
            </div>
            <p className="text-body-secondary small mt-3 mb-0">
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Cumque quibusdam est doloremque perferendis corporis quasi iure minus dicta non quidem....
            </p>
          </div>

          <Comments
            courseInfo={courseInfo}
            data={courseComments} />
        </div>
      </div>
    </div>
  )


}
